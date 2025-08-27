
let arr = [];
let region = [];
let select = document.getElementsByClassName('select')[0];
let country_item = document.getElementsByClassName('country_item')[0];
let search = document.getElementsByClassName('search')[0];
let switch_mode= document.getElementById('switch');
let nav = document.getElementsByTagName('nav')[0];
let box = document.getElementsByClassName('box');
let details = document.getElementsByClassName('details');
let glass = document.getElementById('glass');
let moon = document.getElementById('moon');
let flag = false;
let toolbar = document.getElementById('toolbar');
let details_page = document.getElementsByClassName('details_page')[0];
let map_info = document.getElementById('map');
let marker ;
let borders_grp = document.getElementsByClassName('borders') ; //borders_element;
let back_btn = document.getElementsByClassName('back_btn');

const map = L.map(map_info).setView([20,77],5);//India as Zoom level
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

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
        displayOption(region,'Filter by Region');
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

          

          details.appendChild(name);
          details.appendChild(pop);
          details.appendChild(reg);
          if(arr[i].capital)
         { let cap = document.createElement('p');
          cap.className = 'capital';
          cap.innerHTML = `<span class='bold' >Capital: </span>`+arr[i].capital;
          details.appendChild(cap)}
          box.appendChild(img);
          box.appendChild(details)
          country_item.append(box);
          displayDetailsPage(box,arr[i]);
        }
        region.sort();
        region = Array.from(new Set(region))  ;   

    }
}

function displayOption(region,val){
    opt = document.createElement('option');
    opt.innerHTML = 'Filter by Region';
    opt.value = 'Filter by Region';
    if(val == "Filter by Region")
    select.value = val;
    opt.style.borderRadius = '5px';
    select.append(opt);

    for(let i =0;i<region.length;i++)
{opt = document.createElement('option');
    if (region[i] == val);
   {
   select.value = val;
    }
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
    fetch(`http://localhost:8080/countries?name=${e.target.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
            displayArr();
            let x,y;
            [x,y]= data[0].latlng;
           marker = L.marker([x,y])
                    .addTo(map)
                    .bindPopup(data[0].name)
                    .openPopup();
        }
       else{
        country_item.innerHTML  = 'No Data found';
         marker.remove();
    map.setView([20,77],5);
       }
    })
}
else if(e.target.value.length >0 && select.value !='Filter by Region'){
    fetch(`http://localhost:8080/countries?name=${e.target.value}&region=${select.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
            displayArr();
             let x,y;
            [x,y]= data[0].latlng;
           marker = L.marker([x,y])
                    .addTo(map)
                    .bindPopup(data[0].name)
                    .openPopup();
        }
       else{
        country_item.innerHTML  = 'No Data found';
         marker.remove();
    map.setView([20,77],5);
       }
    })
}
else{
    fetchAll();
    marker.remove();
    map.setView([20,77],5);
select.innerHTML = '';
}
})

//select by region
select.addEventListener("change",(e)=>{
    country_item.innerHTML = '';
    arr = [];
    let sel_val = e.target.value;
    select.value = e.target.value;
if(e.target.value.length >0 && e.target.value != ' ' & e.target.value !='Filter by Region' && search.value.length == 0 ){
    fetch(`http://localhost:8080/countries?region=${e.target.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
            select.value = sel_val
           select.innerHTML = '';
           displayArr();
                   displayOption(region,sel_val);
        }
       else{
        country_item.innerHTML  = 'No Data found';
         marker.remove();
    map.setView([20,77],5);
       }
    })
}
else if(e.target.value.length >0 && e.target.value != ' ' && e.target.value != 'Filter by Region' && search.value.length > 0 ){
    fetch(`http://localhost:8080/countries?region=${e.target.value}&name=${search.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
           select.value = sel_val
           select.innerHTML = '';
           displayArr();
           displayOption(region,sel_val);
        }
       else{
        country_item.innerHTML  = 'No Data found';
         marker.remove();
    map.setView([20,77],5);
       }
    })
}
else if(e.target.value.length >0 && e.target.value != ' ' && e.target.value == 'Filter by Region' && search.value.length > 0 ){
    fetch(`http://localhost:8080/countries?name=${search.value}`)
    .then((res)=> res.json())
    .then((data)=>{
        if(data.length>0){
           arr = data;
           arr.sort();
           displayArr();
        }
       else{
        country_item.innerHTML  = 'No Data found';
         marker.remove();
    map.setView([20,77],5);
       }
    })
}
else{
    select.innerHTML = '';
    fetchAll();
      marker.remove();
    map.setView([20,77],5);
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
});
glass.style.color ='hsl(0, 100%, 100%)';
moon.style.color ='hsl(0, 100%, 100%)';
if(borders_grp){
Array.from(borders_grp).forEach((li)=>{
    li.classList.add('borders_darkmode');
    li.classList.remove('borders_lightmode');
})
}

if(back_btn )
{   
Array.from(back_btn).forEach((li)=>{
li.classList.add('back_btn_darkmode');
     li.classList.remove('back_btn_lightmode');
});  
}
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
if(borders_grp){
Array.from(borders_grp).forEach((li)=>{
    li.classList.add('borders_lightmode');
    li.classList.remove('borders_darkmode');
})
}
if(back_btn)
{   
    Array.from(back_btn).forEach((li)=>{
   li.classList.add('back_btn_lightmode');
     li.classList.remove('back_btn_darkmode');
    })
  
}
}
})


//Details Page
function displayDetailsPage(li,item){

li.addEventListener("click",()=>{
   let x, y;
[x,y]= item.latlng;

 marker = L.marker([x,y]) 
    .addTo(map)
    .bindPopup(item.name)
    .openPopup();

    toolbar.classList.add('disp') ;
    country_item.classList.add('disp');
    details_page.classList.remove('disp');

    let back_btn = document.createElement('input');
    back_btn.className ='back_btn';
    if(flag)//dark mode
    {
back_btn.classList.add('back_btn_darkmode')    ;   
back_btn.classList.remove('back_btn_lightmode')    ;   
    }
    else{
back_btn.classList.add('back_btn_lightmode')    ;   
back_btn.classList.remove('back_btn_darkmode')    ;  
    }
    back_btn.type ='submit';
    back_btn.value = '\u2190 Back';
    details_page.append(back_btn);

let div = document.createElement('div');
div.className ='ex_div';

let info = document.createElement('div');
info.style.cssText ='flex:8;';

let h1 = document.createElement('h1');
h1.innerHTML = item.name;
info.appendChild(h1);

let box1_box2 = document.createElement('div');
box1_box2.className='box1_box2'


let box1 = document.createElement('div');
box1.style.cssText ='flex:6';

let native_name = document.createElement('p');
native_name.classList.add('bold','text');
native_name.innerHTML ='Native Name: <span class="text_value">' + item.nativeName +'</span>';

let population = document.createElement('p');
population.classList.add('bold','text');
population.innerHTML ='Population: <span class="text_value">' + item.population.toLocaleString() +'</span>';

let region = document.createElement('p');
region.classList.add('bold','text');
region.innerHTML ='Region: <span class="text_value">' + item.region +'</span>';

let subregion= document.createElement('p');
subregion.classList.add('bold','text');
subregion.innerHTML ='Sub Region: <span class="text_value">' + item.subregion+ '</span>';



box1.appendChild(native_name);
box1.appendChild(population);
box1.appendChild(region);
box1.appendChild(subregion);
if(item.capital)
{let capital = document.createElement('p');
capital.classList.add('bold','text');
capital.innerHTML ='Capital: <span class="text_value">' + item.capital +'</span>';
box1.appendChild(capital);}


let box2 = document.createElement('div');
box2.style.cssText ='flex:6';

let domain = document.createElement('p');
domain.classList.add('bold','text');
domain.innerHTML ='Top Level Domain: <span class="text_value">' + item.topLevelDomain +'</span>';

let currencies= document.createElement('p');
currencies.classList.add('bold','text');
currencies.innerHTML ='Currencies: <span class="text_value">' + item.currencies.map((li)=>li.name).join();

let languages = document.createElement('p');
languages.classList.add('bold','text');
languages.innerHTML ='Languages: <span class="text_value">' + item.languages.map((li)=>li.name).join();

box2.appendChild(domain);
box2.appendChild(currencies);
box2.appendChild(languages);

box1_box2.appendChild(box1)
box1_box2.appendChild(box2)

info.appendChild(box1_box2);

if(item?.borders){
let span = document.createElement('span');
span.innerHTML = 'Border Countries: ';
span.className ='text';
info.appendChild(span)
for(let i=0;i<item.borders?.length;i++){
let borders = document.createElement('input');
borders.className ='borders'
borders.type='submit';
borders.value = item.borders[i];

    if(flag)//dark mode
    {
borders.classList.add('borders_darkmode') ;
   borders.classList.remove('borders_lightmode') ;
    }
    else{
borders.classList.add('borders_lightmode') ;
   borders.classList.remove('borders_darkmode') ;
    }
info.appendChild(borders);
}
}

let img = document.createElement('img');
img.src = item.flags.png;
img.className = 'details_img'

let gap = document.createElement('div');
gap.style.cssText='flex:1';

div.appendChild(img);
div.appendChild(gap)
div.append(info);

details_page.append(div);




back_btn.addEventListener("click",()=>{
    details_page.innerHTML = '';
    country_item.classList.remove('disp');
toolbar.classList.remove('disp');
details_page.classList.add('disp');
marker.remove();
map.setView([20,77],5);
})
})

}