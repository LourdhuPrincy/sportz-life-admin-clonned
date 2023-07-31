import CardList from "~/components/Card/CardList";
import Card from "../../components/Card/Card";
import CardStats from "../../components/Card/CardStats";
import BarChart from "~/components/BarChart";
import LineChart from "~/components/LineChart";

export default function dashboard() {
  const headCountTrendData = [
    {
      name: "Monday",
      centerA: 4000,
      centerB: 2400,
      amt: 2400,
    },
    {
      name: "Tuesday",
      centerA: 3000,
      centerB: 1398,
      amt: 2210,
    },
    {
      name: "Wednesday",
      centerA: 2000,
      centerB: 9800,
      amt: 2290,
    },
    {
      name: "Thursday",
      centerA: 2780,
      centerB: 3908,
      amt: 2000,
    },
    {
      name: "Friday",
      centerA: 1890,
      centerB: 4800,
      amt: 2181,
    },
    {
      name: "Saturday",
      centerA: 2390,
      centerB: 3800,
      amt: 2500,
    },
    {
      name: "Sunday",
      centerA: 3490,
      centerB: 4300,
      amt: 2100,
    },
  ];
  const centerWiseCountData = [
    {
      name: "Center A",
      uv: 4000,
      count: 2400,
      amt: 2400,
    },
    {
      name: "Center B",
      uv: 3000,
      count: 1398,
      amt: 2210,
    },
    {
      name: "Center C",
      uv: 2000,
      count: 9800,
      amt: 2290,
    },
    {
      name: "Center D",
      uv: 2780,
      count: 3908,
      amt: 2000,
    },
    {
      name: "Center E",
      uv: 1890,
      count: 4800,
      amt: 2181,
    },
  ];

  const sportsWiseCountData = [
    {
      name: "BasketBall",
      uv: 4000,
      count: 2400,
      amt: 2400,
    },
    {
      name: "Volleyball",
      uv: 3000,
      count: 1398,
      amt: 2210,
    },
    {
      name: "Tennis",
      uv: 2000,
      count: 9800,
      amt: 2290,
    },
    {
      name: "Cricket",
      uv: 2780,
      count: 3908,
      amt: 2000,
    },
    {
      name: "Swimming",
      uv: 1890,
      count: 4800,
      amt: 2181,
    },
  ];

  const ageWiseCountData = [
    {
      name: "5-7",
      uv: 4000,
      count: 120,
      amt: 2400,
    },
    {
      name: "8-10",
      uv: 3000,
      count: 138,
      amt: 2210,
    },
    {
      name: "11-13",
      uv: 2000,
      count: 200,
      amt: 2290,
    },
    {
      name: "14-16",
      uv: 2780,
      count: 308,
      amt: 2000,
    },
    {
      name: "17-19",
      uv: 1890,
      count: 400,
      amt: 2181,
    },
  ];
  return (
    <>
      <div className="mb-7 text-lg font-bold"> DASHBOARD </div>
      <div className="text-md mb-5 font-bold"> STATISTICS </div>
      <div className="flex">
        <div className="grid-rows-12 grid w-9/12 grid-cols-6 gap-2">
          <CardStats
            className="col-start-1 col-end-3"
            imageSrc="/images/batch.jpg"
            title="Total Centers"
            count="25"
            percentChange="3"
          />
          <CardStats
            className="col-start-3 col-end-5"
            imageSrc="/images/centers.jpg"
            title="Total Batches"
            count="32"
            percentChange="3"
          />
          <CardStats
            className="col-start-5 col-end-7"
            imageSrc="/images/staff.jpg"
            title="Total Staff"
            count="66"
            percentChange="3"
          />
          <Card className="col-start-1 col-end-7 row-start-2 row-end-3">
            <div> Gender Ratio</div>
          </Card>
          <Card className="col-start-1 col-end-4 row-start-3 row-end-6">
            <BarChart
              title="CENTER WISE HEADCOUNT"
              data={centerWiseCountData}
            />
          </Card>
          <Card className="col-start-4 col-end-7 row-start-3 row-end-6">
            <div> ACTIVITY CALENDAR </div>
          </Card>
          <Card className="row-end-9 col-start-1 col-end-7 row-start-6">
            <LineChart data={headCountTrendData} title="HEADCOUNT TREND DATA" />
          </Card>
          <Card className="row-end-9 row-start-12 col-start-1 col-end-4">
            <div> </div>
            <BarChart title="AGE WISE BREAKUP" data={ageWiseCountData} />
          </Card>
          <Card className="row-end-9 row-start-12 col-start-4 col-end-7">
            <BarChart data={sportsWiseCountData} title="SPORTS WISE COUNT" />
          </Card>
        </div>
        <div className="grid w-3/12 gap-3 ">
          <CardList
            // className="row-span-1"
            title="TOP PERFORMER"
            peoples={[
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports1.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports2.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports3.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports4.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports5.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports6.jpg",
              },
            ]}
            navRoute="/athletes"
          />
          <CardList
            // className="row-span-1"
            title="TOP COACHES"
            peoples={[
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports1.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports2.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports3.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports4.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports5.jpg",
              },
              {
                name: "John H.Martin",
                subtitle: "Volleyball",
                src: "/images/sports6.jpg",
              },
            ]}
            navRoute="/coaches"
          />
          <Card className="row-span-3">UPCOMING TOURNAMENT</Card>
        </div>
      </div>
    </>
  );
}
