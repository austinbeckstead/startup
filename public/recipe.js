
function loadRecipe(){
    let recipes = [];
    const recipesText = localStorage.getItem('recipes');
    if (recipesText) {
      recipes = JSON.parse(recipesText);
    }
    else{
        return;
    }
    let currRecipe = null;
    let currName = localStorage.getItem('currRecipe');
    for (const [i, recipe] of recipes.entries()) {
        if(currName === recipe.name){
            currRecipe = recipe;
            break;
        }
    }
    if (!currRecipe){
        return;
    }
    const galleryBody = document.querySelector('.recipe');

    const name = document.createElement('h2');
    const image = document.createElement('img')
    const macros = document.createElement('div');
    const ingredientsHeader = document.createElement('h4');
    const ingredients = document.createElement('div');
    const instructionsHeader = document.createElement('h4');
    const instructions = document.createElement('div');
    const footer = document.createElement('div');
    const footerName = document.createElement('h4');
    const comments = document.createElement('div');
    const commentList = document.createElement('ul');
    comments.appendChild(commentList);
    const saveButton = document.createElement('button');
    //if (currRecipe.comments){
    //comments.appendChild(generateComments(currRecipe));
    //}
    const commentField = document.createElement('input');
    const submitComment = document.createElement('button');

    configureWebSocket();


    name.textContent = currRecipe.name;
    image.src = currRecipe.image;
    image.className='gallery_image';
    macros.textContent = "Calories: " + currRecipe.calories + "   Protein: " + currRecipe.protein
    + "   Carbs: " + currRecipe.carbs + "   Fat: " + currRecipe.fat;
    ingredientsHeader.textContent ="Ingredients";
    ingredients.textContent = currRecipe.ingredients;
    instructionsHeader.textContent ="Instructions";
    instructions.textContent = currRecipe.instructions;
    footer.className = "recipe-footer";
    footerName.textContent = "Comments"
    comments.classList.add("comments", "overflow-auto");
    commentList.className = "comment-list";
    commentField.type = 'text';
    commentField.className = 'comment-field';
    submitComment.type = 'button'
    submitComment.textContent = "Submit Comment";
    submitComment.onclick = function(){
        submit(localStorage.getItem('username'));
    };
    saveButton.type = 'button';
    saveButton.textContent = "Save Recipe";
    saveButton.onclick = function(){
        saveRecipe(currRecipe);
    };
    galleryBody.appendChild(name);
    galleryBody.appendChild(image);
    galleryBody.appendChild(macros);
    galleryBody.appendChild(ingredientsHeader);
    galleryBody.appendChild(ingredients);
    galleryBody.appendChild(instructionsHeader);
    galleryBody.appendChild(instructions);
    galleryBody.appendChild(footer);
    galleryBody.appendChild(footerName);
    galleryBody.appendChild(comments);
    galleryBody.appendChild(commentField);
    galleryBody.appendChild(submitComment);
    galleryBody.appendChild(saveButton);


}
setInterval(() => {
    const commentList = document.querySelector(".comment-list");
    const newComment = document.createElement('li');
    fetch('https://api.quotable.io/random')
    .then((response) => response.json())
    .then((data) => {
        const commentList = document.querySelector(".comment-list");
        const newComment = document.createElement('li');
        newComment.textContent = data.author + ": " + data.content;
        commentList.appendChild(newComment);

    });
}, 20000);

function submit(name){
    const comment = document.querySelector('.comment-field').value;
    broadcastComment(name, localStorage.getItem('currRecipe'), comment);
    document.querySelector('.comment-field').value = "";
};

async function saveRecipe(recipe){
    let recipes = [];
    const username = localStorage.getItem('username');
    try {
      const response = await fetch(`/api/userRecipes/${username}`);
      if(response.ok){
      recipes = await response.json();
        }
        else{
            const recipesText = localStorage.getItem('userRecipes');
            recipes = JSON.parse(recipesText);  
        }
      }
    catch {
      const recipesText = localStorage.getItem('userRecipes');
        recipes = JSON.parse(recipesText);
    }
    localStorage.setItem('userRecipes', JSON.stringify(recipes));

        for (const [i, r] of recipes.entries()) {
        if(recipe.name === r.name){
            window.location.href = "myRecipes.html";
            return;
        }
    }
    recipes.push(recipe);
    try {
        const saveResponse = await fetch(`/api/userRecipe/${username}`, {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(recipes),
        });
        const saveRecipes = await saveResponse.json();
        localStorage.setItem('userRecipes', JSON.stringify(saveRecipes));
      } catch {
        localStorage.setItem('userRecipes', JSON.stringify(recipes));
}

    window.location.href = "myRecipes.html";

}
function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    this.socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if (msg.recipe === localStorage.getItem('currRecipe')) {
        showComment(msg.from + ': ' + msg.value);
      }
    };
  }

function broadcastComment(from, recipe, value) {
    const event = {
      from: from,
      recipe: recipe,
      value: value,
    };
    this.socket.send(JSON.stringify(event));
  }
  function showComment(comment){
    const commentList = document.querySelector(".comment-list");
    const newComment = document.createElement('li');
    const text = comment;
    newComment.textContent = comment;
    commentList.appendChild(newComment);
  }


/*
function generateComments(recipe){
    const commentList = document.createElement('ul');
    
    for(const [i, comment] of recipe.comments){
        const newComment = document.createElement('li');
        newComment.className = "user";
        newComment.textContent = comment.user + ": " + comment.text;
        commentList.appendChild(newComment);
    }
    
    return commentList

}
function sumbitComment(name, recipeName){
    const text = document.querySelector('.comment-field').value;
    const comment = new Comment(name, text);
    const recipesText = localStorage.getItem('recipes');
    const recipes = JSON.parse(recipesText);
    let recipeIndex = null;
    for (const [i, recipe] of recipes.entries()) {
        if(currName === recipe.name){
            currRecipe = recipe;
            recipeIndex = i;
            break;
        }
    }
    if (!currRecipe){
        return;
    }
    currRecipe.Comment



}
class Comment{
    constructor(user, text){
        this.user = user;
        this.text = text
    }
}
*/
loadRecipe();
