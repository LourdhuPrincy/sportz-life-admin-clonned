import React, { useEffect, useContext, useState, useRef } from "react";
import CardTitle from "~/components/Card/CardTitle";
import { COACH_DETAILS_CONSTANTS } from "~/constants/coachConstants";
import Textbox from "~/components/Textbox";
import {
  type COACH_TYPES,
  type COACH_DETAILS_CONSTANTS_TYPES,
  MultiSelectOption,
} from "~/types/coach";
import { FormContext } from "~/pages/coach/AddCoach/AddCoachMultiFormLayout";
import Button from "../Button";
import { Controller, useForm } from "react-hook-form";
import Datepicker from "~/components/DatePicker/DatePickerWrapper";
import { api } from "~/utils/api";
import { type Sports } from "@prisma/client";
import Select from "react-select";
import { ValueType } from "tailwindcss/types/config";

export default function AddCoach() {
  let inputElement;
  const {
    stepData: { currentStep, setCurrentStep },
    multiFormData: { formData, setFormData },
  } = useContext(FormContext);

  const {
    control,
    getValues,
    reset,
    trigger,
    formState: { errors },
  } = useForm<COACH_TYPES>({ mode: "onChange" });
  const [selectedOption, setSelectedOption] = useState([]);
  const currentFormValues = getValues();
  const { data: sports } = api.sports.getAllSports.useQuery();
  const hasExecuted = useRef(true);

  const [formConstantValues, setFormConstantValues] = useState(
    COACH_DETAILS_CONSTANTS
  );

  const getOptionLabel = (starwarsName: string) => {
    return starwarsName;
  };

  const getOptionValue = (starwarsName: string) => {
    return starwarsName;
  };

  useEffect(() => {
    if (sports?.length && hasExecuted.current) {
      const updatedFormConstantValues = formConstantValues.map(
        (formConstant) => {
          if (formConstant.id === "coachingSports") {
            return {
              ...formConstant,
              options: sports.map((sport: { name: string; id: number }) => ({
                label: sport.name,
                value: sport.id.toString(),
              })),
            };
          } else {
            return formConstant;
          }
        }
      );
      hasExecuted.current = false;
      setFormConstantValues(updatedFormConstantValues);
    }
  }, [formConstantValues, sports, sports?.length]);

  useEffect(() => {
    reset({
      ...currentFormValues,
      ...formData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInputElement = (props: COACH_DETAILS_CONSTANTS_TYPES) => {
    const { type, rules, id, pattern } = props;
    switch (type) {
      case "select":
        const { options } = props;
        inputElement = (
          <Controller
            control={control}
            name={id}
            rules={rules}
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  isMulti={props?.isMulti ?? false}
                  // TODO: fix this TS error
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  options={options}
                  value={value}
                  onChange={(element) => {
                    onChange(element);
                  }}
                />
              );
            }}
          />
        );
        break;
      case "calendar":
        inputElement = (
          <Controller
            control={control}
            render={({ field: { onChange } }) => {
              return (
                <Datepicker
                  placeHolder={props.placeHolder}
                  className="h-12 w-96"
                  onChangeHandler={onChange}
                />
              );
            }}
            name={id}
            rules={rules}
          />
        );
        break;
      default:
        inputElement = (
          <Controller
            control={control}
            name={id}
            render={({ field: { onChange, value } }) => (
              <Textbox
                className="h-12 w-96"
                placeHolder={props.label}
                onChangeHandler={onChange}
                value={value}
              />
            )}
            rules={rules}
            {...(pattern ? { pattern } : {})}
          />
        );
    }

    return inputElement;
  };

  const nextClickHandler = async () => {
    const result = await trigger();
    if (result) {
      const currentFormValues = getValues();
      setFormData && setFormData({ ...formData, ...currentFormValues });
      setCurrentStep && setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      {currentStep === 1 ? (
        <>
          <CardTitle title="ADD COACH" />
          <div className="text-lg font-bold">COACH DETAILS</div>
          <div className="mt-10 grid grid-cols-2 gap-y-12">
            {formConstantValues.map((props) => (
              <div key={props.id}>
                {getInputElement(props)}

                <span className="text-red-800">
                  {errors[props.id]?.type === "required" && (
                    <div>This field is required</div>
                  )}
                  {errors[props.id]?.type === "pattern" && (
                    <div> This field is not matching the pattern</div>
                  )}
                  {errors[props.id]?.type === "maxLength" && (
                    <div>
                      {`This field is exceeding the max. character limit`}
                    </div>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mr-10 mt-10 flex justify-end">
            <Button
              className="border-1 mx-3 bg-pink-600 hover:bg-pink-800"
              type="button"
              onClick={() => void nextClickHandler()}
            >
              Next
            </Button>
          </div>
        </>
      ) : // </form>
      null}
    </>
  );
}
