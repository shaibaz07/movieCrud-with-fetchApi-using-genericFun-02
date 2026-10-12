const cl = console.log;


const showMovieBtn = document.getElementById('showMovieBtn')
const movieContainer = document.getElementById('movieContainer')
const spinner = document.getElementById('spinner')
const movieModal = document.getElementById('movieModal')
const movieForm = document.getElementById('movieForm')
const movieName = document.getElementById('movieName')
const movieImg = document.getElementById('movieImg')
const movieDescription = document.getElementById('movieDescription')
const movieRating = document.getElementById('movieRating')
const movieGener = document.getElementById('movieGener')
const movieReleaseDate = document.getElementById('movieReleaseDate')
const addMovieBtn = document.getElementById('addMovieBtn')
const updateMovieBtn = document.getElementById('updateMovieBtn')
const closeMovieModal = [...document.querySelectorAll('.closeMovieModal')]

const Base_Url = `https://studentpost-5eee3-default-rtdb.asia-southeast1.firebasedatabase.app`
const Movie_Url = `${Base_Url}/moviesWithGener.json`


state = {
    moviesArr: [],
    editId: null
}

function ObjtoArr(obj) {
    for (const key in obj) {
        obj[key].id = key,
            state.moviesArr.unshift(obj[key])
    }
}

function onModalToggle() {
    const changeTxt = document.getElementById('changeTxt')  
    movieModal.classList.toggle('active')
    backDrop.classList.toggle('active')
    changeTxt.innerHTML ='Add Movie'

    movieForm.reset()
    updateMovieBtn.classList.add('d-none')
    addMovieBtn.classList.remove('d-none')


}

function setRating(rating) {
    if (rating >= 4) {
        return "badge-success"
    } else if (rating >= 3 && rating < 4) {
        return "badge-warning"
    } else {
        return "badge-danger"
    }
}

function showSpinner() {
    spinner.classList.remove('d-none');
}
function hideSpinner() {
    spinner.classList.add('d-none');
}

function snackBar(msg, icon) {
    swal.fire({
        title: msg,
        icon: icon,
        timer: 2500,
        confirmButtonColor: "#212529"
    })
}


function makeApiCall(Url, methodName, msgBody) {
    msgBody = msgBody ? JSON.stringify(msgBody) : null;
    return fetch(Url, {
        method: methodName,
        body: msgBody,
        headers: {
            "Content-Type": "application/json",
            "Auth": "JWT Token"

        }
    })
        .then(res => {
            if (!res.status) {
                throw new Error(`HTTP ERROR : ${res.status}`)
            }
            return res.json()
        })
        .catch(err => {
            cl(err)
        })


}


function readMovie(arr) {
    let result = ``
    arr.forEach(movie => {

        result += `
            <div class="col-md-3 mb-4" id="${movie.id}">
                <div class="card movieCard h-100">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10 mb-2">
                                <h4 class="m-0">${movie.movieName}</h4>

                            </div>
                            <div class="col-2">
                                <h5 class="m-0">
                                    <span class="badge ${setRating(movie.movieRating)}">${movie.movieRating}</span> 

                                </h5>
                            </div>
                        </div>
                        <small class ="pl-2 text-secondary"> <strong> CreatedAt: </strong>${new Date(movie.createdAt).toLocaleString("en-In")}</small> <br>

                        ${movie.updatedAt ? `<small class = "pl-2 text-secondary"> <strong> updatedAt : </strong>${new Date(movie.updatedAt).toLocaleString("en-IN")}</small>` : ""}

                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${movie.movieImg}" alt="${movie.movieName}" title="${movie.movieName}">

                            <figcaption>
                                <h3>${movie.movieName}</h3>
                                 <div class="text-secondary">
                                <h5 >${movie.movieGener}</h5>
                                    <h6>Release Date : ${movie.movieReleaseDate}</h6>
                                </div>
                                <p>${movie.movieDescription}.</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick ="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onClick= "onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>

                    </div>
                </div>


            </div>
        
        
        
                `

        movieContainer.innerHTML = result;
    });
}


function fetchMovie() {
    showSpinner()
    makeApiCall(Movie_Url, "GET", null)
        .then(res => {
            ObjtoArr(res)

            readMovie(state.moviesArr)

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })
}


fetchMovie()


function onMovieAdd(eve) {
    eve.preventDefault()

    let newMovie = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value,
        movieGener: movieGener.value,
        movieReleaseDate: movieReleaseDate.value,
        createdAt: Date.now(),
        updatedAt: null

    }

    onModalToggle()
    showSpinner()
    makeApiCall(Movie_Url, "POST", newMovie)
        .then(res => {
            newMovie.id = res.name;
            state.moviesArr.unshift(newMovie)

            let card = document.createElement("div")
            card.id = res.name,
                card.className = 'col-md-3 mb-4'
            card.innerHTML = `
            
                 <div class="card movieCard h-100">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10 mb-2">
                                <h4 class="m-0">${newMovie.movieName}</h4>

                            </div>
                            <div class="col-2">
                                <h5 class="m-0">
                                    <span class="badge ${setRating(newMovie.movieRating)}">${newMovie.movieRating}</span>

                                    

                                </h5>
                            </div>
                        </div>
                        <small class ="pl-2 text-secondary" > <strong> CreatedAt: </strong>${new Date(newMovie.createdAt).toLocaleString("en-In")}</small>
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${newMovie.movieImg}" alt="${newMovie.movieName}" title="${newMovie.movieName}">

                            <figcaption>
                                <h3>${newMovie.movieName}</h3>
                                 <div class="text-secondary">
                                <h5 >${newMovie.movieGener}</h5>
                                    <h6>Release Date : ${newMovie.movieReleaseDate}</h6>
                                </div>
                                <p>${newMovie.movieDescription}.</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick ="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onClick= "onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>

                    </div>
            
            
                    `
            movieContainer.prepend(card)
            snackBar(`The Movie with id: ${newMovie.id} is added successfully !!!`, 'success')
        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })

}


function onMovieEdit(ele) {
    let EditId = ele.closest('.col-md-3').id;
    state.editId = EditId

    const changeTxt = document.getElementById('changeTxt')  
    onModalToggle()
    changeTxt.innerHTML = 'Update Movie'

    let EditObj = state.moviesArr.find(m => m.id === EditId)

    movieName.value = EditObj.movieName;
    movieImg.value = EditObj.movieImg;
    movieDescription.value = EditObj.movieDescription;
    movieRating.value = EditObj.movieRating;
    movieGener.value = EditObj.movieGener;
    movieReleaseDate.value = EditObj.movieReleaseDate

    addMovieBtn.classList.add('d-none');
    updateMovieBtn.classList.remove('d-none')
}


function onMovieUpdate() {
    let UpdateId = state.editId;
    let UpdateUrl = `${Base_Url}/moviesWithGener/${UpdateId}.json`

    let movie = state.moviesArr.find(m => m.id === UpdateId)

    let UpdatedObj = {
        movieName: movieName.value,
        movieImg: movieImg.value,
        movieDescription: movieDescription.value,
        movieRating: movieRating.value,
        movieGener: movieGener.value,
        movieReleaseDate: movieReleaseDate.value,
        createdAt: movie.createdAt,
        updatedAt: Date.now(),
        id: UpdateId
    }

    onModalToggle()

    showSpinner()
    makeApiCall(UpdateUrl, "PATCH", UpdatedObj)
        .then(res => {


            let getIdx = state.moviesArr.findIndex(m => m.id === UpdateId)
            state.moviesArr[getIdx] = UpdatedObj

            let col = document.getElementById(UpdateId)
            col.innerHTML = `
                    
                <div class="card movieCard h-100">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10 mb-2">
                                <h4 class="m-0">${UpdatedObj.movieName}</h4>

                            </div>
                            <div class="col-2">
                                <h5 class="m-0">
                                    <span class="badge ${setRating(UpdatedObj.movieRating)}">${UpdatedObj.movieRating}</span>

                                    

                                </h5>
                            </div>
                        </div>
                         <small class="pl-2 text-secondary"> <strong> Created: </strong>${new Date(UpdatedObj.createdAt).toLocaleString("en-In")}</small><br>
                        <small class="pl-2 text-secondary"> <strong> UpdatedAt: </strong>${new Date(UpdatedObj.updatedAt).toLocaleString("en-In")}</small>
                    </div>
                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${UpdatedObj.movieImg}" alt="${UpdatedObj.movieName}" title="${UpdatedObj.movieName}">

                            <figcaption>
                                <h3>${UpdatedObj.movieName}</h3>
                                 <div class="text-secondary">
                                <h5 >${UpdatedObj.movieGener}</h5>
                                    <h6>Release Date : ${UpdatedObj.movieReleaseDate}</h6>
                                </div>
                                <p>${UpdatedObj.movieDescription}.</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick ="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onClick= "onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>

                    </div>
            
                    
                    
                    
                    
                    
                  `

            updateMovieBtn.classList.add('d-none');
            addMovieBtn.classList.remove('d-none')

            snackBar(`The Movie with id: ${UpdateId} is updated successfully !!!`, 'success')


        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })

}




function onMovieRemove(ele) {

    let RemoveId = ele.closest('.col-md-3').id;
    // cl(RemoveId)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#212529",
        cancelButtonColor: "rgb(193, 17, 25)",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner()
            let RemoveUrl = `${Base_Url}/moviesWithGener/${RemoveId}.json`

            makeApiCall(RemoveUrl, "DELETE", null)
                .then(res => {
                    let getIdx = state.moviesArr.findIndex(m => m.id === RemoveId)
                    state.moviesArr.splice(getIdx, 1);

                    ele.closest('.col-md-3').remove()

                    snackBar(`The Movie with id: ${RemoveId} is removed successfully !!!`, 'success')

                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                    hideSpinner()
                })
        }
    });



}




showMovieBtn.addEventListener('click', onModalToggle)


closeMovieModal.forEach(ele => {
    ele.addEventListener('click', onModalToggle)
})

updateMovieBtn.addEventListener('click', onMovieUpdate)
movieForm.addEventListener('submit', onMovieAdd)

