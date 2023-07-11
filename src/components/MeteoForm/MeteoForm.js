import React, { useState } from "react";
import DataTable from "./DataTable";

const MeteoForm = () => {
  const [formFields, setFormFields] = useState({
    metar: false,
    sigmet: false,
    taf: false,
    isCheckedMinimum: true,
    airports: [],
    countries: [],
    isAirportOrCountryEmpty: false,
  });

  const defaultRequestStatus = {
    success: false,
    loading: false,
  };
  const [requestStatus, setRequestStatus] = useState(defaultRequestStatus);
  const [meteoResponse, setMeteoResponse] = useState([]);

  const validateStringLength = (stringArr, regex) => {
    return stringArr.find((string) => !regex.test(string)) ? true : false;
  };

  const validateFields = () => {
    const { metar, sigmet, taf, airports, countries } = formFields;
    let isValid = true;
    if (!metar && !sigmet && !taf) {
      setFormFields((prev) => {
        return { ...prev, isCheckedMinimum: false };
      });
      isValid = false;
    }
    if (
      (airports.length === 0 && countries.length === 0) ||
      validateStringLength(airports, /^[A-Za-z]{4}$/) ||
      validateStringLength(countries, /^[A-Za-z]{2}$/)
    ) {
      setFormFields((prev) => {
        return { ...prev, isAirportOrCountryEmpty: true };
      });
      isValid = false;
    }
    return isValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) {
      //reset state and setup loading
      setMeteoResponse([]);
      setRequestStatus((prev) => {
        return { ...prev, loading: true };
      });

      const reportTypes = [];
      if (formFields.metar) reportTypes.push("METAR");
      if (formFields.taf) reportTypes.push("TAF_LONGTAF");
      if (formFields.sigmet) reportTypes.push("SIGMET");

      const request = {
        id: "query01",
        method: "query",
        params: [
          {
            id: "briefing01",
            reportTypes,
            stations: formFields.airports,
            countries: formFields.countries,
          },
        ],
      };

      fetch("https://ogcie.iblsoft.com/ria/opmetquery", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setRequestStatus((prev) => ({ ...prev, success: true }));

          setTimeout(() => {
            setRequestStatus(defaultRequestStatus);
            if (data.result) setMeteoResponse(data.result);
          }, 1000);
        })
        .catch((error) => {
          setRequestStatus(defaultRequestStatus);
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="md:flex md:items-center mb-1 flex-col">
      <form className="w-full max-w-sm" onSubmit={onSubmit}>
        <div className="md:flex md:items-center mb-1">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Message Types:
            </label>
          </div>
          <div
            className="md:w-2/3 block text-gray-500 font-bold flex gap-4"
            id="msg-types"
          >
            <label>
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                checked={formFields.metar}
                onChange={(e) => {
                  setFormFields((prev) => {
                    return { ...prev, metar: e.target.checked };
                  });
                  if (e.target.checked) {
                    setFormFields((prev) => {
                      return { ...prev, isCheckedMinimum: true };
                    });
                  }
                }}
              />
              <span className="text-sm">METAR</span>
            </label>
            <label>
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                checked={formFields.sigmet}
                onChange={(e) => {
                  setFormFields((prev) => {
                    return { ...prev, sigmet: e.target.checked };
                  });
                  if (e.target.checked) {
                    setFormFields((prev) => {
                      return { ...prev, isCheckedMinimum: true };
                    });
                  }
                }}
              />
              <span className="text-sm">SIGMET</span>
            </label>
            <label>
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                checked={formFields.taf}
                onChange={(e) => {
                  setFormFields((prev) => {
                    return { ...prev, taf: e.target.checked };
                  });
                  if (e.target.checked) {
                    setFormFields((prev) => {
                      return { ...prev, isCheckedMinimum: true };
                    });
                  }
                }}
              />
              <span className="text-sm">TAF</span>
            </label>
          </div>
        </div>
        {!formFields.isCheckedMinimum && (
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <p className="text-red-500 text-xs italic ">
                Please check at least 1 option.
              </p>
            </div>
          </div>
        )}
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Airports:
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="airports"
              type="text"
              onChange={(e) => {
                let airports = [];
                if (e.target.value) airports = e.target.value.split(" ");
                setFormFields((prev) => {
                  return { ...prev, airports: airports };
                });
                if (e.target.value !== "") {
                  setFormFields((prev) => {
                    return { ...prev, isAirportOrCountryEmpty: false };
                  });
                }
              }}
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Countries:
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="countries"
              type="text"
              onChange={(e) => {
                let countries = [];
                if (e.target.value) countries = e.target.value.split(" ");
                setFormFields((prev) => {
                  return { ...prev, countries: countries };
                });
                if (e.target.value !== "") {
                  setFormFields((prev) => {
                    return { ...prev, isAirportOrCountryEmpty: false };
                  });
                }
              }}
            />
            {formFields.isAirportOrCountryEmpty && (
              <p className="text-red-500 text-xs italic mt-2 ">
                Please fill out country or airport. Country is composed of 2
                letters and airport is composed of 4 letters.
              </p>
            )}
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            {!requestStatus.loading ? (
              <button
                className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={
                  formFields.areCountriesEmpty ||
                  formFields.areAirportsEmpty ||
                  !formFields.isCheckedMinimum
                }
              >
                Create Briefing
              </button>
            ) : (
              <ul className="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400 ">
                {requestStatus.success ? (
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    Request processed
                  </li>
                ) : (
                  <li className="flex items-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                    Loading...
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </form>
      <DataTable data={meteoResponse} />
    </div>
  );
};

export default MeteoForm;
