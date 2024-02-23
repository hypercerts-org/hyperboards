/** Convert a 2D array into a CSV string
 */
export function arrayToCsv(headers: string[], data: any[][]) {
  const formattedHeaders = headers.join(",");
  const formattedRows = data.map(
    (row) =>
      row
        .map(String) // convert every value to String
        .map((v) => v.replaceAll('"', '""')) // escape double quotes
        .map((v) => `"${v}"`) // quote it
        .join(","), // comma-separated
  );

  return [formattedHeaders, ...formattedRows].join("\r\n"); // rows starting on new lines
}

export function parseCsv(
  csv: string,
  separator = ",",
): Record<string, string>[] {
  const [headerRow, ...rows] = csv.split("\r\n");
  const headers = headerRow.split(separator);
  const data = rows.map((row) =>
    row.split(separator).map((v) => {
      if (v.startsWith('"') && v.endsWith('"')) {
        return v.slice(1, -1);
      }
      return v;
    }),
  );

  return data.map((row) => {
    return row.reduce((acc, value, index) => {
      const key = headers[index];

      return {
        ...acc,
        [key]: value,
      };
    }, {});
  });
}
