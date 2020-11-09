
var amt = 150;
var dark = 50;
var unic;
var level = 0;
var second=10;
var t = true;
var idInt;

initGame(document.querySelector('#game')); // запускаем игру

//основная функция игры
function initGame(game){

	level++;
	levelgame(level);

	var field = game.querySelector('.field');

	var size = 2;

	document.getElementById("timer").innerHTML = '';

	doIt();
	newGame(); //запуск новой игры


	function newGame(){

		clear(field);
		var cells = restgame(size,field);
		func(cells,unic);

	}

	function func(cells,unic) {


			for (var i = 0; i < cells.length; i++) {
					cells[i].addEventListener('click', function(){

					var thisColor = toHexColor(this.style.backgroundColor);

					//проверка выбранного(нажатого) квадрата
					if(thisColor == unic){//если ок всё, то новый уровень
						size++;
						level++;
						levelgame(level);
						newGame();
					}
					else{//если ошиблись, то таймер обновляется и игра начинается с начала

						alert("Упс, Вы ошиблись! Игра завершена.");

						size=2;
						level = 1;
						amt = 200;
						dark = 20;
						levelgame(level);

						clearInterval(idInt);
						doIt();
						newGame();
					}

				});

			}

	}

	//рабоат с временем игры (счётчик времени)
	function doIt() {

        	i = 30;
	        idInt = setInterval(function() {

								//игры с цветом времени
		            if (i <= 15) {
		                document.getElementById("timer").style.color = "red";
		            }
		            if(i>15){
		            	document.getElementById("timer").style.color = "black";
		            }

								//установка времени
		            document.getElementById("timer").innerHTML = i;

								//провекра на оончание вреени игры
								// если 0, то всё, зе энд, новая игра
		            if (i == 0) {

		                alert("Время вышло!");
		                clearInterval(idInt);

		                size=2;
										level = 1;
										amt = 200;
										dark = 20;
										levelgame(level);

										doIt();
										newGame();
		            }
								//счётчик времени, на - с каждой секундой
		            if(i>=0){
		            	i = i - 1;
		            }

	        	}, 1000);

	}
	//хеширование цвета для ...
	function toHexColor( color ) {
	    return color.replace( /rgba?\(([^\)]+)\)|#([a-f0-9]{6}|[a-f0-9]{3})/ig, function( m, rgb, hex ) {
	        if ( rgb = /([0-9\.]+)(\%?)\s*,\s*([0-9\.]+)(\%?)\s*,\s*([0-9\.]+)(\%?)\s*(?:,\s*([0-9\.]+))?/g.exec( rgb || "" ) ) {
		            hex = parseInt( rgb[2] ? rgb[1] * 2.55 : rgb[1] ).toString( 16 ).replace( /^(.)$/, '0$1' ) +
			            	parseInt( rgb[4] ? rgb[3] * 2.55 : rgb[3] ).toString( 16 ).replace( /^(.)$/, '0$1' ) +
				            	parseInt( rgb[6] ? rgb[5] * 2.55 : rgb[5] ).toString( 16 ).replace( /^(.)$/, '0$1' );
		            m = rgb[ 7 ] == "" || rgb[ 7 ] === undefined ? 1 : parseFloat( rgb[ 7 ] );
		    } else if ( hex && ( m = 1 ) ) {
				hex = hex.replace( /^(.)(.)(.)$/, "$1$1$2$2$3$3" );

	        } else {
	            return m;

	        }

	        return "#" + hex;

	    });

	}
}


// вывод текста увровня
function levelgame(level){

	let elem = document.getElementById('myhead');
	elem.innerHTML =`Уровень `+ level;
}

//очистка поля игры
function clear(field){
	field.innerHTML = '';
}

//переход на новый уровень
function restgame(size, field){
	var collelem = size*size;

	var all = Color(); //основной цвет
	dark = dark+10; //значение изменения цвета
	unic = UnicColor(all,amt-dark); //цвет нужного квадрата

	var arr = [];
	arr = createArr(all,unic,collelem);
	arr = shuffleArr(arr); //пеемешиваем массив цветов
	arr = chunkArr(arr); //разбивка на части
	return createCells(arr,field); //создаётся поле игры

}


//рандомим значение цвета
function randColor(){
	var c=parseInt(Math.random()*255).toString(16);
	return (""+c).length==1?'0'+c:c;
};
//получаем этот цвет
function Color() {
	var col='#'+randColor()+randColor()+randColor();
	return col;
}
//получили этот же цвет, но намного светлее // заходит в #
function UnicColor(col, amt) {

	var usePound = false;

	if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;


    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

}

//создание ячеек таблицы игрового поля
function createCells(arr, elem) {
	cells = [];
	for (var i = 0; i < arr.length; i++) {
		var tr = document.createElement('tr');
		for (var j = 0; j < arr[i].length; j++) {
			var td = document.createElement('td');
			td.style.backgroundColor = arr[i][j];
			tr.appendChild(td);

			cells.push(td);
		}
		elem.appendChild(tr);
	}

	return cells;
}

//тут будут значения цветов (all - все клетки, кроме одной, нужно - unic)
//т.е. all - какой-то рандомный цвет, 100% яркости, а unic - этот же цвет, но намного светлее
//те.е тут одномерный массив значений цвета
function createArr(all, unic, collelem) {
	var arr = [];

	var u = getRandomInRange(0, collelem-1);

	for (var i = 0; i < collelem; i++) {
		if(i==u) arr.push(unic);
		else arr.push(all);
	}

	return arr;
}
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//перемешиваем значения массива
function shuffleArr(arr) {
	var result = [];
	var length = arr.length;

	for (var i = 0; i < length; i++) {
		var random = getRandomInt(0,arr.length-1);
		var elem = arr.splice(random,1)[0];
		result.push(elem);
	}

	return result;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//разбиваем на части (корень из количества элементов одномерного масссива)
function chunkArr(arr) {
	var result = [];

	var n = Math.sqrt(arr.length);

	var iterCount = Math.ceil(arr.length/n);
	for (var i = 0; i < iterCount; i++) {
		var elems = arr.splice(0,n);
		result.push(elems);
	}

	return result;
}
