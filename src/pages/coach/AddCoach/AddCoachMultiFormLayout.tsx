import React, { useState, useContext, useCallback, useEffect } from "react";
import Card from "~/components/Card";
import ImageWithFallback from "~/components/ImageWithFallback";
import { useForm } from "react-hook-form";
import AddCoach from "../../../components/AddCoach/AddCoach";
import AddCoachCertificates from "~/components/AddCoach/AddCoachCertificates";
import AssignBatches from "~/components/AddCoach/AssignBatches";
import {
  type TRAINING_LEVEL,
  type GENDER_VALUES,
  type MULTI_FORM_TYPES,
  type EXPERIENCE_LEVEL,
  type CoachWithRelationsEditForm,
} from "~/types/coach";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { ToastContext } from "~/contexts/Contexts";
import FileUpload from "~/components/FileUpload";
import { getSportsDictionaryServices } from "~/services/sportServices";
import { type BatchTableData } from "~/types/batch";
import { dateFormat } from "~/helpers/date";
import { type MultiSelectOption } from "~/types/select";

const multiFormData: MULTI_FORM_TYPES = {
  contactNumber: "",
  name: "",
  designation: "",
  email: "",
  about: "",
  dateOfBirth: undefined,
  payroll: "",
  coachingSports: [],
  certificates: [],
  batchIds: [],
  centerIds: [],
};

const defaultValues = {
  stepData: {
    currentStep: 1,
  },
  multiFormData: {
    formData: multiFormData,
  },
};
export interface FormContextTypes {
  stepData: {
    currentStep: number;
    setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  };
  multiFormData: {
    formData: MULTI_FORM_TYPES;
    setFormData?: React.Dispatch<React.SetStateAction<MULTI_FORM_TYPES>>;
  };
}
export const FormContext = React.createContext<FormContextTypes>(defaultValues);

export default function AddCoachMultiFormLayout() {
  let coach: CoachWithRelationsEditForm | null | undefined;
  const router = useRouter();
  const id = Number(router?.query?.id);
  if (id) {
    // eslint-disable-next-line no-console
    // console.log(id);
    coach = api.coach.getCoachById.useQuery({ id: id }).data;
  }

  const methods = useForm();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<MULTI_FORM_TYPES>(
    defaultValues.multiFormData.formData
  );
  const { setOpenToast } = useContext(ToastContext);
  const [preview, setPreview] = useState<(File & { preview: string })[]>([]);
  const { data: sports } = api.sports.getAllSports.useQuery();
  const sportsDictionary = getSportsDictionaryServices(sports);
  const { data: centers } = api.center.getAllCenters.useQuery();
  const { data: batches } = api.batches.getAllBatches.useQuery();
  // eslint-disable-next-line no-console
  console.log(coach);

  useEffect(() => {
    if (coach) {
      setFormData({
        ...coach,
        dateOfBirth: coach?.dateOfBirth
          ? coach?.dateOfBirth?.toISOString()
          : "",
        gender: { label: coach.gender, value: coach.gender },
        coachingSports: coach?.sports?.reduce(
          (accumulator: MultiSelectOption[], sport) => {
            const label = sportsDictionary?.[sport.sportId]?.name;
            const value = sportsDictionary?.[sport.sportId]?.id;
            if (label && value) {
              accumulator.push({
                label: label,
                value: value,
              });
            }
            return accumulator;
          },
          []
        ),
        trainingLevel: {
          label: coach.trainingLevel,
          value: coach.trainingLevel,
        },
        experienceLevel: {
          label: coach.experienceLevel,
          value: coach.experienceLevel,
        },
        certificates: coach?.certificates.map((cert) => ({
          ...cert,
          startEnd: cert.startEnd ? dateFormat(cert.startEnd) : "",
          endDate: cert.endDate ? dateFormat(cert.endDate) : "",
        })),
        batchTableData:
          coach.batches.reduce((accumulator: BatchTableData[], coachBatch) => {
            const batch = batches?.find(
              (batch: { id: number }) => batch.id == coachBatch.batchId
            );
            const center = centers?.find(
              (center) =>
                center.id ==
                batches?.find((batch) => batch.id == coachBatch.batchId)
                  ?.centerId
            );
            if (batch && center) {
              accumulator.push({
                centerId: center?.id,
                batchIds: [batch?.id],
                centerName: center?.name,
                batchName: batch?.name,
              });
            }
            return accumulator;
          }, []) ?? undefined,
        batchIds: [],
        centerIds: [],
      });
      // methods.reset(coach);
    }
  }, [batches, centers, coach, sportsDictionary]);

  // centerId: string;
  // centerName: string;
  // batchName: string;
  // batchIds: number[];

  const formProviderData = {
    ...methods,
    stepData: { currentStep, setCurrentStep },
    multiFormData: { formData, setFormData },
  };
  const {
    // data,
    mutate,
    // isLoading: isLoading,
  } = api.coach.createCoach.useMutation({
    onSuccess: (response) => {
      setOpenToast(true);
      void router.push(`/coach/${response?.id ?? ""}`);
    },
  });

  const onDropCallback = useCallback((acceptedFiles: Array<File>) => {
    setPreview(
      acceptedFiles.map((upFile) =>
        Object.assign(upFile, {
          preview: URL.createObjectURL(upFile),
        })
      )
    );
  }, []);

  const finalFormSubmissionHandler = (
    finalForm: Required<MULTI_FORM_TYPES>
  ) => {
    mutate({
      name: finalForm.name,
      about: finalForm.about,
      contactNumber: finalForm.contactNumber,
      email: finalForm.email,
      designation: finalForm.designation,
      gender: finalForm.gender.value as (typeof GENDER_VALUES)[number],
      certificates: finalForm.certificates,
      dateOfBirth: new Date(finalForm.dateOfBirth),
      sports: finalForm.coachingSports,
      trainingLevel: finalForm.trainingLevel
        .value as (typeof TRAINING_LEVEL)[number],
      experienceLevel: finalForm.experienceLevel
        .value as (typeof EXPERIENCE_LEVEL)[number],
      batchIds: finalForm.batchIds,
      centerIds: finalForm.centerIds,
    });
  };
  return (
    <FormContext.Provider value={formProviderData}>
      <div className="grid grid-cols-6 grid-rows-1">
        <Card className="col-span-4 ml-10 h-full p-0 pl-10 pt-10">
          {currentStep === 1 && <AddCoach />}
          {currentStep === 2 && <AddCoachCertificates />}
          {currentStep === 3 && (
            <AssignBatches
              // TODO: fix this TS error
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: Unreachable code error
              finalFormSubmissionHandler={finalFormSubmissionHandler}
            />
          )}
        </Card>
        <Card className="col-span-2 bg-gray-100">
          <div className="mb-10 font-bold">Coach Image</div>

          <div>
            {preview.length ? (
              preview.map((upFile, index) => {
                return (
                  <div
                    className="previewImage mb-5 flex justify-center rounded-full"
                    key={index}
                  >
                    <ImageWithFallback
                      className="rounded-2xl"
                      src={upFile.preview}
                      alt="preview"
                      height={205}
                      width={205}
                      fallbackSrc="/images/fallback.png"
                    />
                  </div>
                );
              })
            ) : (
              <div className="previewImage">
                <ImageWithFallback
                  src={""}
                  alt="preview"
                  height={500}
                  width={500}
                  fallbackSrc="/images/fallback.png"
                />
              </div>
            )}
            <div className="mb-5 flex justify-center">
              <FileUpload onDropCallback={onDropCallback} />{" "}
            </div>

            {/* <ImageWithFallback
              width={500}
              height={500}
              src=""
              alt=""
              fallbackSrc="/images/fallback.png"
            /> */}
          </div>
          {/* <a className="mb-10 flex justify-center"> Upload Image</a> */}
          <div>
            <span className="mb-5 font-bold">Note</span>
            <ul className="list-disc">
              <li>Please upload jpg, png, .tiff file formats only</li>
              <li>Maximum Size 100 MB</li>
              <li>Minimum dimension 500px width by 500px height</li>
            </ul>
          </div>
        </Card>
        {/* <pre>{JSON.stringify(watch())}</pre> */}
      </div>
    </FormContext.Provider>
  );
}
