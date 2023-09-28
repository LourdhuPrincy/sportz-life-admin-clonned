import type { CoachWithRelations } from "~/pages/coach/[id]";

export default function CoachCertificateTableBody({
    coach
} : {
    coach: CoachWithRelations
}) {
    const tableItems = coach.batches.map( batch =>
        <tr 
            className="h-14 text-gray-600 font-bold w-full"
            key={ batch.batchId }>
            <td className="rounded-l-lg border-l-2 border-y-2 border-solid pl-5">{ batch.batch.name }</td>
            <td className="border-y-2 border-solid">{ batch.center.name }</td>
            <td className="border-y-2 border-solid">0</td>
            <td className="border-y-2 border-solid">{ batch.assignedAt.toString() }</td>
            <td className="rounded-r-lg border-r-2 border-y-2 border-solid">...</td>
        </tr>
    );

    return (
        <tbody>
            { tableItems }
        </tbody>
    )
}