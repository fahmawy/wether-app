// my server url to open the application on the browser
const myserver = "http://localhost:8000";

//base URL for the website of api
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Creating a new date to use it on append details after geting the details from the API
var date = new Date();
var newDate = date.toDateString();

/* to make concatunate for the url fo make full request like 
https://api.openweathermap.org/data/2.5/weather?zip=90210&appid=c29963b5077fddc47ce3415d314b236c
The Appid is the key that i get it from the openweathermap account 
*/

const apiKey = ",&appid=c29963b5077fddc47ce3415d314b236c";



/*********************************************
*************** genData Function *************
**********************************************
 * get input values using get elementby id and get value  
 * Call Request_Wizard_Details to fetch API
 * Create Object using destructuring
 * Posting Data 
 * Append Data to client Side 
 */

const genData = () => {

  //get input values from the input fields (from Cliet Side )
  const zipCode = document.getElementById("zip").value;
  const youFeel = document.getElementById("feelings").value;

  // getWeatherData return promise to start maping
  Request_Wizard_Details(zipCode).then((data) => {

    if (data) { //validate is data exist or no 
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;

      const info = {
        newDate,
        city,
        temp: temp,
        description,
        youFeel,
      };
      // make post request to route add with info object  
      postData(myserver + "/add", info);

      append_data(); // call function that will append html in the client side 

    }
  });
};


/*********************************************
************* End genData Function ***********
**********************************************/


/*********************************************
************* append_data async Function ***********
**********************************************/
const append_data = async () => {
  const res = await fetch(myserver + "/all");
  /*
  after get response from the api call i will recived resposnse hold data 
  all o fthis data will be ready to append to the html parts 
  */
  try {
    const status = await res.json();

    document.getElementById("maping_data").innerHTML = `<p>
                                                          <span class="today">${status.newDate}</span><br>
                                                          <span class="city">${status.city}</span><br>
                                                          <span class="temp">${status.temp}</span><br>
                                                          <span class="desc">${status.description}</span><br>
                                                          <span class="feeling">${status.youFeel}</span>
                                                        <p>`;
  } catch (err) {
    /*
      if we face any issue it will throw an error and i will console log the error
    */
    console.log(err);
  }
};


// i will append data inside the div maping_data like City not found
const err = document.getElementById("maping_data");

// call event listner by click on the element with id get_data and call the genData function
document.getElementById("get_data").addEventListener("click", genData);


/*********************************************
************* End append_data  ***********
**********************************************/



//Function to GET Web API Data
const Request_Wizard_Details = async (zipCode) => {
  try {
    const res = await fetch(baseURL + zipCode + apiKey);
    const data = await res.json();

    if (data.cod != 200) {
      // display the error message on UI
      err.innerHTML = data.message;
      setTimeout(_ => error.innerHTML = '', 2000)
      throw `${data.message}`;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};


/*********************************************
*********** Posting Data from line 54  *******
**********************************************/
const postData = async (url = "", info = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //important part to define request in header to be json
    },
    body: JSON.stringify(info),
  });

  try {
    const newData = await res.json();
    return newData;
  } catch (err) {
    console.log(err);
  }
};

