import React from 'react';

export const FetchModelPrices = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <table className="border-collapse border border-white text-white">
        <tbody>
          {[...Array(4)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(4)].map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-white w-20 h-20 text-center align-middle"
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