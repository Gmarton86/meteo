import React, { useMemo } from "react";

const DataTable = ({ data }) => {
  const groupBy = (_k, a) =>
    a.reduce(
      (r, { [_k]: k, ...p }) => ({
        ...r,
        ...{ [k]: r[k] ? [...r[k], { ...p }] : [{ ...p }] },
      }),
      {}
    );

  const groupedData = useMemo(() => {
    return groupBy("stationId", data);
  }, [data]);

  return (
    <table className="table-auto text-gray-500 font-bold mt-14">
      <tbody>
        {Object.keys(groupedData).map((key) => (
          <StationRecords
            key={key}
            station={key}
            stationProperties={groupedData[key]}
          />
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;

const StationRecords = ({ station, stationProperties }) => {
  return (
    <>
      <tr>
        <td className="border px-4 py-2 text-white">{station}</td>
        <td className="border px-4 py-2"></td>
        <td className="border px-4 py-2"></td>
      </tr>
      {(stationProperties ?? []).map((stationProperty, index) => (
        <StationRecord
          key={`${index}-${station}`}
          stationProperty={stationProperty}
        />
      ))}
    </>
  );
};

const StationRecord = ({ stationProperty }) => {
  const { queryType, reportTime, textHTML, text } = stationProperty;
  return (
    <tr>
      <td className="border px-4 py-2">{queryType}</td>
      <td className="border px-4 py-2">{reportTime}</td>
      <td className="border px-4 py-2">
        {textHTML ? (
          <div dangerouslySetInnerHTML={{ __html: textHTML }}></div>
        ) : (
          text
        )}
      </td>
    </tr>
  );
};
