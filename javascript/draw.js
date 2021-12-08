function draw_sensor(draw_width, draw_height, id_convas, min_val, max_val, val, lebel_step, lebel_step1){ //Рисуем датчик 
    
  let drawingCanvas = document.getElementById(id_convas);
    if(drawingCanvas && drawingCanvas.getContext) {  
    let ctx = drawingCanvas.getContext('2d');
    drawingCanvas.width = draw_width;
    drawingCanvas.height = draw_height;    
    let min_size = (draw_width < draw_height) ? draw_width : draw_height; // минимальный размер холста по ширине или высоте 
    // Заливаем холст
    ctx.strokeStyle = "#eee";
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, draw_width, draw_height);

    function draw_sektor(x_center, y_center, radius_sector, rgb_sector, home_rad, end_rad){// Рисуем часть сектора датчика 
      ctx.strokeStyle = rgb_sector;
      ctx.fillStyle = rgb_sector;
      ctx.beginPath();
      ctx.arc(x_center, y_center, radius_sector, home_rad, end_rad, false);
      ctx.arc(x_center, y_center, radius_sector*0.9, end_rad, home_rad, true);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
    
    // рисуем сектор датчика 
    let col_sec = 1024;
    let red_collor = "0";
    let grean_collor = "0";
    let blue_collor = "0";
    for (let i=0; i < col_sec; i++) {
      if (i / col_sec < 0.5){ //задаем свет rgb части сектора датчика
        red_collor = "0";
        grean_collor = String(Math.round(255 * (i) / col_sec * 2));
        blue_collor = String(Math.round(255 * ((col_sec-col_sec/2) - i) / col_sec*2));
      }
      else{
        red_collor = String(Math.round(255 * (i - col_sec / 2) / col_sec * 2));
        grean_collor = String(Math.round(255 * (col_sec - i) / col_sec*2));
        blue_collor = "0";
      }
      my_collor = "rgb("+ String(red_collor) + "," + String(grean_collor) + "," + String(blue_collor) +")"; 
      draw_sektor(draw_width / 2, draw_height / 2, min_size / 3, my_collor, Math.PI*3/4 + Math.PI*6/4/col_sec*i, Math.PI*3/4 + Math.PI*3/4/col_sec + Math.PI*6/4/col_sec*i);
    }
    //Рисуем стрелку
    let degree_x = draw_width/2 -  min_size/3 * Math.cos((val-min_val)/(max_val - min_val)*Math.PI*3/2 + Math.PI*7/4);
    let degree_y = draw_height/2 -  min_size/3 * Math.sin((val-min_val)/(max_val - min_val)*Math.PI*3/2 + Math.PI*7/4);
    ctx.beginPath();
    ctx.strokeStyle = "#f00";
    ctx.fillStyle = "#f00";   
    ctx.moveTo(degree_x, degree_y);  
    ctx.arc(draw_width/2, draw_height/2, min_size/40, (val-min_val)/(max_val - min_val)*Math.PI*3/2 + Math.PI*1/4, Math.PI+(val-min_val)/(max_val - min_val)*Math.PI*3/2 + Math.PI*1/4, true);
    ctx.lineTo(degree_x, degree_y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.arc(draw_width / 2, draw_height / 2, min_size / 30, 0, Math.PI *2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
//Пишем показания датчика 
    let str_val = String(val);
    let point = str_val.indexOf(".", 1);
    if (point < 0){
      str_val += ".00";
    } else if (str_val.length - point == 2) {
      str_val += "0";}
    ctx.font = String(min_size/10) + "px Times New Roman";
    ctx.fillStyle = "Black";
    ctx.fillText(str_val, draw_width / 2 - min_size / 10, draw_height / 2 + min_size /10 * 2.2);

    //ставим метки на шкале
    let label_x = 0;
    let label_y = 0;
    for (let i = 0; i <= max_val - min_val; i++){
      if ((i + min_val)%lebel_step == 0){
        label_x = draw_width / 2 - min_size / 3.35 * Math.cos(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
        label_y = draw_height / 2 - min_size / 3.35 * Math.sin(i/ (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.moveTo(label_x, label_y);
        label_x = draw_width / 2 - min_size / 2.85 * Math.cos(i/ (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
        label_y = draw_height / 2 - min_size / 2.85 * Math.sin(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
        ctx.lineWidth = 3;
        ctx.lineTo(label_x, label_y)
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
// делаем подписи к шкале
        label_x = draw_width / 2 - min_size / 2.5 * Math.cos(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
        label_y = draw_height / 2 - min_size / 2.5 * Math.sin(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
        ctx.font = String(min_size / 15) + "px Times New Roman";
        ctx.fillStyle = "Black";
        ctx.fillText(String(i + min_val), label_x - min_size / 30, label_y + min_size/30);
      }
    }

    //ставим промежуточные метки
      for (let i = 0; i <= max_val - min_val; i++) {
        if ((i + min_val) % lebel_step1 == 0) {
          label_x = draw_width / 2 - min_size / 3.35 * Math.cos(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
          label_y = draw_height / 2 - min_size / 3.35 * Math.sin(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
          ctx.beginPath();
          ctx.strokeStyle = "#000";
          ctx.fillStyle = "#000";
          ctx.moveTo(label_x, label_y);
          label_x = draw_width / 2 - min_size / 2.95 * Math.cos(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
          label_y = draw_height / 2 - min_size / 2.95 * Math.sin(i / (max_val - min_val) * Math.PI * 3 / 2 + Math.PI * 7 / 4);
          ctx.lineWidth = 1;
          ctx.lineTo(label_x, label_y)
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

        }
      }


  }
}

window.onload = function() {
  let size_draw = 0;
  if (window.innerWidth/3 < window.innerHeight){
    size_draw = window.innerWidth/3 -10;
  }
  else {
    size_draw = window.innerHeight;
  }
  draw_sensor(size_draw, size_draw, 'temp_home', 15, 30, 25, 5, 1);
  draw_sensor(size_draw, size_draw, 'temp_strit', -50, 50, 10.5, 10, 5);
  draw_sensor(size_draw, size_draw, 'temp_boller', 0, 100, 45, 5, 10);
 }
