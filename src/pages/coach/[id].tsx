import Button from "~/components/Button";
import Card from "~/components/Card";
import CardTitle from "~/components/Card/CardTitle";
import Image from "next/image";
import { prisma } from "~/server/db";
import { type GetServerSidePropsContext } from "next";
import {
  type Coach,
  type Certificates,
  type Sports,
  type CoachesOnSports,
} from "@prisma/client";
import { DATE_TIME_FORMAT, NO_DATA } from "~/globals/globals";

type CoachWithRelations = Coach & {
  certificates: Certificates[];
  sports: CoachesOnSports[];
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context?.params?.id;
  const sports = await prisma.sports.findMany();
  console.log(sports);
  const coach = await prisma.coach.findUnique({
    where: {
      id: id ? Number(id) : undefined,
    },
    include: {
      sports: true,
      certificates: true,
    },
  });

  return {
    props: {
      coach: {
        ...coach,
        createdAt: coach?.createdAt?.toISOString(),
        updatedAt: coach?.updatedAt?.toISOString(),
        dateOfBirth: coach?.dateOfBirth
          ? coach?.dateOfBirth?.toISOString()
          : "",
        sports: coach?.sports.map((sport) => ({
          ...sport,
          assignedAt: sport?.assignedAt ? sport?.assignedAt?.toISOString() : "",
          updatedAt: sport?.updatedAt ? sport?.updatedAt?.toISOString() : "",
        })),
      },
      sports: sports,
    },
  };
};

export default function Page({
  coach,
  sports,
}: {
  coach: CoachWithRelations;
  sports: Sports[];
}) {
  const sportsDictionary = sports?.reduce(
    (accumulator: Record<number, string>, current) => {
      accumulator[current.id] = current.name;
      return accumulator;
    },
    {}
  );

  return (
    <Card className="h-100 mx-5">
      <header className="flex justify-between">
        <CardTitle title="COACH DETAILS" />
        <Button>Edit Coach</Button>
      </header>
      <div className="flex">
        <Image
          className="h-40 w-40 rounded-full"
          src={"/images/rugby.jpg"}
          alt=""
          width="300"
          height="200"
        />
        <div className="w-10/12 px-10">
          <div className="mt-5 font-bold">
            <span> {coach.name} </span>
            <span> ({coach.designation})</span>
          </div>
          <div className="text-orange-400">
            {coach.sports
              .map(({ sportId }) => sportsDictionary[sportId])
              .join(",")}
          </div>
          <div className="mt-5 flex justify-between">
            <div>
              <div className="text-gray-400"> Contact Number </div>
              <div className="font-bold text-gray-600">
                {coach.contactNumber}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Email</div>
              <div className="font-bold text-gray-600">{coach.email}</div>
            </div>
            <div>
              <div className="text-gray-400">DOB</div>
              <div className="font-bold text-gray-600">
                {coach.dateOfBirth
                  ? DATE_TIME_FORMAT.format(new Date(coach.dateOfBirth))
                  : ""}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Gender</div>
              <div className="font-bold text-gray-600">{coach.gender}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-10/12 justify-between">
        <div className="w-60 rounded-lg border-2 border-solid border-gray-400 p-5">
          <div className="font-bold"> Attendance</div>
          <div className="text-4xl font-bold"> 60%</div>
        </div>
        <div className="w-60 rounded-lg border-2 border-solid border-gray-400 p-5">
          <div className="font-bold"> Batches</div>
          <div className="text-4xl font-bold"> 04</div>
        </div>
        <div className="w-60 rounded-lg border-2 border-solid border-gray-400 p-5">
          <div className="font-bold"> Certificates</div>
          <div className="text-4xl font-bold">
            {coach?.certificates?.length ?? NO_DATA}
          </div>
        </div>
      </div>
    </Card>
  );
}
