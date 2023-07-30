async function titleAKA() {
              
  const title = document.getElementById("titleGet").value;
  const captitle1 = title;

  //split the above string into an array of strings 
  //whenever a blank space is encountered

  const arr = captitle1.split(" ");

  //loop through each element of the array and capitalize the first letter.


  for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

  }

  //Join all the elements of the array back into a string 
  //using a blankspace as a separator 
  const captitle = arr.join(" ");
  console.log(captitle);

  if (!captitle) {
  return;
  }

  const url = `https://moviesdatabase.p.rapidapi.com/titles/search/akas/${captitle}`
  // const url = 'https://moviesdatabase.p.rapidapi.com/titles/search/akas/Dune';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '2d42d5ca3dmshd28b866e3c63cb3p1e535bjsne14d801b9475',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    showMovies(result);
    
  } catch (error) {
    console.error(error);
  }
}

function showMovies(result) {
  result.forEach(movie => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    
  })
}

