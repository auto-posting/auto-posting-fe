interface Table {
  theadData: [];
  tbodyData: [][];
}

export default function Table({ theadData, tbodyData }: Table) {
  if (!tbodyData || tbodyData.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {theadData.map(item => (
            <th>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tbodyData.map((rowData, rowIndex) => (
          <tr key={rowIndex}>
            {rowData.map((cellData: string, cellIndex: number) => (
              <td key={cellIndex}>{cellData}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
