/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useContext, useState } from "react";
import Select from "~/components/Select";
import { COACH_CERTIFICATES_CONSTANTS } from "~/constants/coachConstants";
import Textbox from "~/components/Textbox/Textbox";
import Datepicker from "~/components/DatePicker/DatePickerWrapper";
import Button from "~/components/Button/Button";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Table from "~/components/Table";
import { type COACH_CERTIFICATE_TABLE_TYPES } from "~/types/coach";
import CertificateTableHeader from "../CertificateTable/CertificateTableHeader";
import CertificateTableBody from "../CertificateTable/CertificateTableBody";
import {
  FormContext,
  type FormContextTypes,
} from "~/pages/coach/AddCoach/AddCoachMultiFormLayout";
import CardTitle from "../Card/CardTitle";

export default function AddCoachCertificates({}) {
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      instituteName: "",
      startDate: "",
      endDate: "",
    },
  });

  const {
    stepData: { currentStep, setCurrentStep },
    multiFormData: { formData, setFormData },
  } = useContext<FormContextTypes>(FormContext);

  const [tableData, setTableData] = useState<
    COACH_CERTIFICATE_TABLE_TYPES[] | []
  >([]);

  const onSubmit: SubmitHandler<COACH_CERTIFICATE_TABLE_TYPES> = () => {
    console.log("onSubmit");
  };

  const onAddHandler = async () => {
    const data = getValues();
    let result = true;
    if (!data.name || !data.instituteName) {
      result = await trigger();
    }
    if (result) {
      if (tableData?.length) {
        setTableData([data, ...tableData]);
      } else {
        setTableData([data]);
      }
      reset();
    }
  };

  const prevClickHandler = () => {
    setFormData && setFormData({ ...formData, certificateData: tableData });
    setCurrentStep && setCurrentStep(currentStep - 1);
  };

  const onNextClickHandler = () => {
    if (Object.keys(errors).length === 0) {
      setFormData && setFormData({ ...formData, certificateData: tableData });
      setCurrentStep && setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      <div onSubmit={handleSubmit(onSubmit)}>
        <CardTitle title="ADD COACH" />
        <div className="text-xl font-bold">ADD CERTIFICATES</div>
        <div className="mt-10 flex flex-row gap-5 justify-between">
          <div className="w-full">
            <Controller
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    className="h-12 w-full"
                    {...COACH_CERTIFICATES_CONSTANTS}
                    onChangeHandler={onChange}
                    value={value ?? undefined}
                  />
                );
              }}
              rules={{ required: true }}
              name="name"
            />
            {errors.name && (
              <div className="text-red-800">This field is required</div>
            )}
          </div>

          <div className="w-full">
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Textbox
                  placeHolder="Institute Name"
                  className="h-12 w-full"
                  onChangeHandler={onChange}
                  value={value}
                />
              )}
              name="instituteName"
              rules={{ required: true }}
            />
            {errors.instituteName && (
              <div className="text-red-800">This field is required</div>
            )}
          </div>
        </div>
        <div className="mt-10 grid grid-cols-3 w-2/3">
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Datepicker
                  placeHolder="Start"
                  className="h-12 w-full"
                  onChangeHandler={onChange}
                  value={value}
                />
              );
            }}
            name="startDate"
            className="w-1/3"

          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              console.log(value);
              return (
                <Datepicker
                  className="ml-3 h-12 w-full"
                  placeHolder="End"
                  onChangeHandler={onChange}
                  value={value}
                />
              );
            }}
            name="endDate"
            className="w-1/3"
          />
          <Button className="ml-5 w-20" onClick={onAddHandler}>
            Add
          </Button>
        </div>
        {tableData.length !== 0 && (
          <div className="mt-5">
            <Table
              tableHeader={<CertificateTableHeader />}
              tableBody={<CertificateTableBody data={tableData} />}
            />
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <Button
            className="bg-pink-600 hover:bg-pink-800"
            onClick={prevClickHandler}
          >
            Prev
          </Button>
          <Button
            className="mx-3 bg-pink-600 hover:bg-pink-800"
            onClick={onNextClickHandler}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
