
let arr = [];
let region = [];
let select = document.getElementsByClassName('select')[0];
let country_item = document.getElementsByClassName('country_item')[0];
let search = document.getElementsByClassName('search')[0];
let default_select = document.getElementById('default_select');
let switch_mode= document.getElementById('switch');
let nav = document.getElementsByTagName('nav')[0];
let box = document.getElementsByClassName('box');
let details = document.getElementsByClassName('details');
let glass = document.getElementById('glass');
let moon = document.getElementById('moon');
let flag = false;

fetchAll();

function fetchAll(){

    fetch('http://localhost:8080/countries')
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
        }
        displayArr();
    })
}

function displayArr(){
    if(arr.length>0){
        for(let i=0;i<arr.length;i++)
        {
          region.push(arr[i].region);
          let box = document.createElement('div');
          box.className ='box';
          let img = document.createElement('img');
          img.className ='img';
          img.src = arr[i].flags.png;

          let details= document.createElement('div');
          details.className='details';

          let name = document.createElement('h3');
          name.innerHTML = arr[i].name;
          name.className ='name';

          let pop = document.createElement('p');
          pop.className = 'pop';
          pop.innerHTML = `<span class='bold' >Population: </span>`+arr[i].population.toLocaleString();

          let reg = document.createElement('p');
          reg.className = 'reg';
          reg.innerHTML = `<span class='bold'  >Regions: </span>`+arr[i].region;

          let cap = document.createElement('p');
          cap.className = 'capital';
          cap.innerHTML = `<span class='bold' >Capital: </span>`+arr[i].capital;

          details.appendChild(name);
          details.appendChild(pop);
          details.appendChild(reg);
          details.appendChild(cap)
          box.appendChild(img);
          box.appendChild(details)
          country_item.append(box);
        }
        region.sort();
        region = Array.from(new Set(region))
        displayOption(region)
    }
}

function displayOption(region){
    opt = document.createElement('option');
    opt.innerHTML = 'Filter by Region';
    opt.id='default_select'
    opt.value = 'Filter by Region';
    opt.setAttribute('selected',true);
    opt.style.borderRadius = '5px';
    select.append(opt);

    for(let i =0;i<region.length;i++)
{opt = document.createElement('option');
opt.innerHTML = region[i];
opt.value = region[i];
opt.className = 'opt';
select.append(opt);}
}

//search by country{
search.addEventListener("input",(e)=>{
country_item.innerHTML = '';
arr= [];
if(e.target.value.length >0 && select.value =='Filter by Region'){
    fetch(`http://localhost:8080/countries?name_like=${e.target.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
            displayArr();
        }
       else{
        country_item.innerHTML  = 'No Data found'
       }
    })
}
else if(e.target.value.length >0 && select.value !='Filter by Region'){
    fetch(`http://localhost:8080/countries?name_like=${e.target.value}&region=${select.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
            displayArr();
        }
       else{
        country_item.innerHTML  = 'No Data found'
       }
    })
}
else{
    fetchAll();
}
})

//select by region
select.addEventListener("change",(e)=>{
    country_item.innerHTML = '';
    arr = [];
if(e.target.value.length >0 && e.target.value != ' ' & e.target.value !='Filter by Region' && search.value.length == 0 ){
    fetch(`http://localhost:8080/countries?region_like=${e.target.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
           select.innerHTML = '';
           displayArr();
        }
       else{
        country_item.innerHTML  = 'No Data found';
       }
    })
}
else if(e.target.value.length >0 && e.target.value != ' ' & e.target.value !='Filter by Region' && search.value.length > 0 ){
    fetch(`http://localhost:8080/countries?region_like=${e.target.value}&name_like=${search.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
           select.innerHTML = '';
           displayArr();
        }
       else{
        country_item.innerHTML  = 'No Data found';
       }
    })
}
else{
    fetchAll();
}
})


//toggle mode
switch_mode.addEventListener('click',()=>{
flag = !flag;
if(flag){ //dark mode
document.body.style.cssText ='color:hsl(0, 100%, 100%);background-color:hsl(207, 26%, 17%)';
nav.style.cssText= 'background-color:hsl(209, 23%, 22%);box-shadow:1px 1px 3px hsl(200, 15%, 8%)';
search.style.cssText= 'background-color:hsl(209, 23%, 22%);color:hsl(0, 100%, 100%); box-shadow: 1px 1px 5px hsl(200, 15%, 8%);';
select.style.cssText= 'background-color:hsl(209, 23%, 22%);color:hsl(0, 100%, 100%);box-shadow: 1px 1px 5px hsl(200, 15%, 8%);';
Array.from(box).forEach((li)=>{
    li.style.boxShadow = '1px 1px 3px hsl(200, 15%, 8%)';
    li.children[1].style.backgroundColor='hsl(209, 23%, 22%);';
}
);
glass.style.color ='hsl(0, 100%, 100%)';
moon.style.color ='hsl(0, 100%, 100%)';
}
else if(flag == false){//light mode
document.body.style.cssText ='color:hsl(200, 15%, 8%);background-color:hsl(0, 0%, 99%)';
nav.style.cssText = 'background-color:hsl(0, 100%, 100%);box-shadow: 1px 1px 3px hsl(0, 0%, 50%);';
search.style.cssText = 'background-color:hsl(0, 100%, 100%);color:hsl(200, 15%, 8%); box-shadow: 1px 1px 3px hsl(0, 0%, 50%)';
select.style.cssText = 'background-color:hsl(0, 100%, 100%);color:hsl(200, 15%, 8%); box-shadow: 1px 1px 3px hsl(0, 0%, 50%);';
Array.from(box).forEach((li)=>{li.style.boxShadow = '1px 1px 3px hsl(0, 0%, 50%)'
    li.children[1].style.backgroundColor='hsl(0, 100%, 100%);';
});
glass.style.color ='hsl(0, 0%, 50%)';
moon.style.color ='hsl(0, 0%, 50%)';
}
})