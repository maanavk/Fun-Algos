const addBook = document.querySelector(".button.add")
const removeBook = document.querySelector(".button.remove")
const searchBook = document.getElementById("search")
const menu = document.querySelector(".menu-container")
const mainScreen = `<div class = "header" style="opacity:0;">Your Books</div>
        <div class = "button-container" style="opacity:0;">
            <div class = "button add">Add new book?</div>
            <div class = "button remove" >Remove a book?</div>
            <div class = "button search" style="cursor:default;">Search for a book?<input id = "search"type="text" placeholder = "Eg. Harry Potter"></div>
        </div>`
let bookshelf = {}
let stored = {}

function editDistance(s1,s2){
    let matrix = [];
    for(let i=0; i<s1.length + 1; i++) {
        matrix[i] = new Array(s2.length + 1);
    }
    let i = 0
    let j = 0
    while (i <= s1.length) {
        if (i == 0){
            matrix[0][j] = j;
        }
        else if (j == 0){
            matrix[i][0] = i;
        }
        else{
            matrix[i][j] = Math.min(matrix[i-1][j] + 1, matrix[i][j-1] + 1, matrix[i-1][j-1] + (s1[i-1] === s2[j-1]? 0 : 1));
        }
        if (j == s2.length){
            j = 0;
            i += 1;
        }
        else{
            j += 1;
        }
    }
    return matrix[s1.length][s2.length]
}

function searchFor(){
    const s = this.value.trim();
    const errorMax = 2
    if (!(s in stored)){
        stored[s] = {}
    }
    for (const bookString in bookshelf){
        let error;
        if (bookString in stored[s]){
            error = stored[s][bookString]
        }
        else{
            if (bookString.length > s.length){
                error = editDistance(s,bookString.slice(0,s.length))
            }
            else{
                error = editDistance(s,bookString)
            }
            stored[s][bookString] = error
        }
        if (error > errorMax){
            document.getElementById(bookString.replaceAll(" ","-")).classList.add("fade");
        }
        if (error <= errorMax){
            document.getElementById(bookString.replaceAll(" ","-")).classList.remove("fade")
        }
    }
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

const searchForDebounced = debounce(searchFor, 1000)

function Book(title, author, pages, read, color){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.color = color;
    this.info = function(){
        return `${title} by ${author}, ${pages} pages, ${read? "read" : "not read yet"}.`
    }
}

let hue = 0;

function closeBookInfo(){
    setTimeout( () => {
    this.style["width"] = "40px"
    this.style["background-color"] = this.style["border-color"]
    this.removeChild(this.querySelector(".info-text"))
    this.removeChild(this.querySelector(".info-text"))
    this.removeChild(this.querySelector(".vert-bar"))
    const horizBar = document.createElement("div")
    horizBar.classList.add("book-bar")
    this.textContent = bookshelf[this.id.replaceAll("-"," ")].title;
    this.classList.toggle("book")
    this.classList.remove("open-book")
    this.appendChild(horizBar)
    this.removeEventListener("mouseleave",closeBookInfo);
    this.addEventListener("mouseover",viewBookInfo)},20)
}

function viewBookInfo(){
    this.style["width"] = "80px";
    currentBook = bookshelf[this.textContent];
    this.removeChild(this.querySelector(".book-bar"));
    this.classList.toggle("book");
    this.style["border-color"] = currentBook.color;
    this.style["background-color"] = "beige";
    this.classList.add("open-book");
    const vertBar = document.createElement("div");
    vertBar.classList.add("vert-bar");
    const page1 = document.createElement("div");
    page1.classList.add("info-text");
    const page2 = document.createElement("div");
    page2.classList.add("info-text");
    this.textContent = "";
    page1.textContent = `title: ${currentBook.title} read: ${currentBook.read? "yes" : "no"} `
    page2.textContent = `by: ${currentBook.author} \n pages: ${currentBook.pages} \n `
    this.appendChild(page1);
    this.appendChild(vertBar);
    this.appendChild(page2);
    this.addEventListener("mouseleave",closeBookInfo);
    this.removeEventListener("mouseover",viewBookInfo);
}

function getNextColor() {
    hue = (hue + 137.5) % 360; 
    return `hsl(${hue}, 75%, 50%)`; 
}


function addToShelf(newBook){
    const book = document.createElement("div");
    book.textContent = newBook.title;
    book.id = newBook.title.replaceAll(" ", "-");
    book.style["background-color"] = newBook.color;
    const bookBar = document.createElement("div");
    bookBar.classList.add("book-bar");
    book.append(bookBar);
    book.classList.add("book");
    book.addEventListener("mouseover",viewBookInfo);
    bookshelf[newBook.title] = newBook;
    document.querySelector(".bookshelf").append(book);

}

function openForm(){
    const menuHeader = menu.querySelector(".header")
    menuHeader.style["opacity"] = 0;
    menu.querySelector(".button-container").style["opacity"] = 0;
    const exitButton = document.createElement("div");
    setTimeout(() => { 
        menuHeader.textContent = "New Books";       
        exitButton.innerHTML = '<div class="material-icons" id = "back">arrow_back</div> <button style = "border:none;background-color:inherit;" type = "submit"><div class="material-icons" id = "submit">add</div></input>';
        exitButton.classList.add("exit");
        menu.querySelector(".button-container").innerHTML = '<form> <div class = "button search" style="cursor:default;">Enter title<input id = "title"type="text" placeholder = "Eg. Harry Potter" required></div><div class = "button search" style="cursor:default;">Enter page number<input id = "page-number"type="number" placeholder = "Eg. 69" required></div> <div class = "button search" style="cursor:default;">Enter author<input id = "author"type="text" placeholder = "Eg. Maanav Kaistha" required></div></form>'
        menu.querySelector(".button-container>form").appendChild(exitButton);
        menuHeader.style["opacity"] = 1;
        menu.querySelector(".button-container").style["opacity"] = 1;
        document.getElementById("back").addEventListener("click", closeForm);
        const form = document.querySelector("form");
        form.addEventListener("submit", verifyForm);
        },300)

    

}

function closeForm(){
    const menuHeader = menu.querySelector(".header")
    menuHeader.style["opacity"] = 0;
    menu.querySelector(".button-container").style["opacity"] = 0;
    setTimeout(() => {menu.innerHTML = mainScreen},300);
    setTimeout(() => { 
        
        menu.querySelector(".header").style["opacity"] = 1;
        menu.querySelector(".button-container").style["opacity"] = 1;
        document.querySelector(".button.add").addEventListener("click",openForm);
        document.querySelector(".button.remove").addEventListener("click",deleteBook);
        document.getElementById("search").addEventListener("input",searchFor);},350)

}

function verifyForm(event) {
    event.preventDefault();
    const form = event.target;
    
    const title = form.elements["title"].value;
    const author = form.elements["author"].value;
    const pageNumber = form.elements["page-number"].value;
    const color = getNextColor()
    const newBook = new Book(title, author, pageNumber, false, color);
    if (title in bookshelf){   
        form.elements["title"].setCustomValidity("Book already found! Try again");
        setTimeout(() => {
            form.elements["title"].setCustomValidity("");
        }, 2000);
    } 
    else{
        form.elements["title"].setCustomValidity("");
        addToShelf(newBook);
        closeForm();
    }
}

function eviscerateBook(){
    delete bookshelf[this.textContent]; document.querySelector(".bookshelf").removeChild(this);
}
function darkenText(){
    this.style["font-weight"] = 400;
}
function deleteBook(){
    if (document.querySelectorAll(".book").length === 0){
        return
    }
    this.removeEventListener("mouseout",darkenText)
    
    this.style["font-weight"] = 600;
    this.removeEventListener("click",deleteBook);
    const books = document.querySelectorAll(".book");
    books.forEach(book => {
        book.classList.add("shake")
        book.addEventListener("click",eviscerateBook)
        book.removeEventListener("mouseover",viewBookInfo)
    });
    const handleBodyClick = function(e) {
        if (!e.target.classList.contains("book")) {
            this.style["font-weight"] = 400;
            books.forEach(book => {
                book.classList.remove("shake");
                book.removeEventListener("click", eviscerateBook);
                book.addEventListener("mouseover",viewBookInfo);
            });
            document.body.removeEventListener("click", handleBodyClick);
            this.addEventListener("click",deleteBook)
            this.addEventListener("mouseover",()=>{this.style["font-weight"] = 600;})
            this.addEventListener("mouseout",darkenText)
        }
    }.bind(this);

    setTimeout(() => { // Use a timeout to prevent immediate triggering
        document.body.addEventListener("click", handleBodyClick);
    }, 0);}
document.querySelector(".button.add").addEventListener("click",openForm);
document.querySelector(".button.remove").addEventListener("click",deleteBook);
document.getElementById("search").addEventListener("input",searchForDebounced);