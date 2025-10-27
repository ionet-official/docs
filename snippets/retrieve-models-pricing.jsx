import React from 'react';

export const FetchModelPrices = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <table className="border-collapse border border-gray-400">
        <tbody>
          {[...Array(4)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(4)].map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-400 w-20 h-20 text-center align-middle"
                >
                  {`R${rowIndex + 1}C${colIndex + 1}`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}