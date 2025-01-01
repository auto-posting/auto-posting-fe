interface Table {
  theadData: string[];
  tbodyData: Array<Record<string, string | number>> | undefined;
  onDelete?: (index: number) => void;
}

export default function Table({ theadData, tbodyData, onDelete }: Table) {
  const handleDelete = (index: number) => {
    if (onDelete) {
      onDelete(index);
    }
  };

  if (!tbodyData || tbodyData.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <table className="border border-gray rounded">
      <thead className="border">
        <tr>
          {theadData.map((item, index) => (
            <th key={`${item}-${index}`}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tbodyData.map((rowData, rowIndex) => (
          <tr key={rowIndex}>
            {theadData.map((header, cellIndex) => (
              <td key={cellIndex} className="border-b">
                {rowData[header.toLowerCase().replace(/ /g, '_')] || ''}
              </td>
            ))}
            {onDelete && (
              <td className="border-b">
                <button onClick={() => handleDelete(rowIndex)}>✕</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
