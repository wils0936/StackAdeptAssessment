const target = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSvowAT52nYidFW0JXMK9itpl-oG-7jvLN7Kdq8eHNA0_z-M-RpTj0qOMUBM3Rzvq_3yRAK3lAEHF-H/pub?output=csv`; //file

/**
 * The function `csvToArray` takes a CSV string as input and converts it into a 2D array, excluding the
 * header row.
 * @param csv - The `csv` parameter is a string that represents a CSV (Comma-Separated Values) file.
 * @returns The function `csvToArray` returns an array of arrays, where each inner array represents a
 * row of values from the CSV input.
 */
function csvToArray(csv) {
  const rows = csv.split("\n");
  const result = [];

  for (const row of rows) {
    const values = row.split(",");
    result.push(values);
  }
  result.shift();
  return result;
}

/**
 * The function takes an array of arrays and converts it into an array of objects, where each object
 * represents a row of data from the input array.
 * @param arrayOfArrays - An array of arrays where each inner array represents a row of data. Each
 * inner array should have the following structure:
 * @returns an array of objects.
 */
function arraysToObjects(arrayOfArrays) {
  var objects = [];
  arrayOfArrays.forEach((row) => {
    let item = new Object();
    item.id = arrayOfArrays.indexOf(row) + 1;
    item.headlineCopy = row[0];
    item.dateOfSale = row[1] + "," + row[2];
    item.dateOfSale = JSON.parse(item.dateOfSale);
    item.productImageLink = row[3];
    objects.push(item);
  });

  return objects;
}

/**
 * The function `checkDate` takes an array of objects with a `dateOfSale` property, sorts them in
 * descending order based on the `dateOfSale`, and returns the first object with a `dateOfSale` that is
 * before today's date.
 * @param dataArray - An array of objects, where each object represents a sale and has a property
 * called "dateOfSale" that represents the date of the sale.
 * @returns the first element in the `dataArray` that has a `dateOfSale` value that is before today's
 * date.
 */
function checkDate(dataArray) {
  let todaysDate = new Date();
  let datedArray = dataArray.sort(function (ob1, ob2) {
    return new Date(ob2.dateOfSale) - new Date(ob1.dateOfSale);
  });
  let beforeToday = datedArray.find((date) => {
    let datesTime = new Date(date.dateOfSale).getTime();
    return datesTime < todaysDate.getTime();
  });

  return beforeToday;
}

/**
 * The `downloadCsv` function fetches a CSV file from a given URL, converts it to an array of objects,
 * and checks the date format in the objects.
 * @param target - The `target` parameter in the `downloadCsv` function is the URL of the CSV file that
 * you want to download and process.
 * @returns The function `downloadCsv` returns a promise that resolves to the result of the `checkDate`
 * function.
 */
const downloadCsv = async (target) => {
  try {
    const res = await fetch(target, {
      method: "get",
      headers: {
        "content-type": "text/csv;charset=UTF-8",
      },
    });

    if (res.status === 200) {
      const data = await res.text();
      return checkDate(await arraysToObjects(await csvToArray(await data)));
    } else {
      console.log(`Error code ${res.status}`);
      throw new Error();
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * The `runAd` function displays an advertisement by fetching data from a CSV file and updating the ad
 * space with the image and headline.
 */
async function runAd() {
  const adSpace = document.getElementById("adSpace");
  const adImage = document.getElementById("adImage");
  const adTitle = document.getElementById("adTitle");
  const adEscape = document.createElement("button");

  adEscape.innerHTML = "x";
  adEscape.id = "adEscape";
  adEscape.addEventListener("click", (ev) => {
    adSpace.style.display = "none";
  });
  adSpace.append(adEscape);

  let show = await downloadCsv(target);
  adImage.src = show.productImageLink;
  adTitle.innerHTML = show.headlineCopy;
  adImage.alt = "Image of advertisement.";
  adSpace.style.display = "flex";
}

/* The `setTimeout` function is a built-in JavaScript function that allows you to delay the execution
of a function by a specified amount of time. In this case, `setTimeout(() => { runAd(); }, 1000);`
is delaying the execution of the `runAd` function by 1000 milliseconds (1 second). After the delay,
the `runAd` function will be called and the advertisement will be displayed. */
setTimeout(() => {
  runAd();
}, 1000);
