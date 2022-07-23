var i = 1 ;
function addForm() {
  var input_data = document.createElement('input');
  input_data.type = 'text';
  input_data.id = 'inputform_' + i;
  input_data.name = 'fishName';
  input_data.className = "form-control";
  input_data.placeholder = 'フォーム-' + i;
  var input_file = document.createElement('input');
  input_file.type = 'file';
  input_file.id = 'inputform_' + i;
  input_file.name = 'fishImage_' + i;
  input_file.class = "form-control"
  input_file.placeholder = 'フォーム-' + i;
  var parent = document.getElementById('form_area');
  parent.appendChild(input_data);
  parent.appendChild(input_file);


  var button_data = document.createElement('button');
  button_data.id = i;
  button_data.onclick = function(){deleteBtn(this);}
  button_data.innerHTML = '削除';
  var input_area = document.getElementById(input_data.id);
  parent.appendChild(button_data);

  i++ ;
}

function deleteBtn(target) {
  var target_id = target.id;
  var parent = document.getElementById('form_area');
  var ipt_cl = document.getElementsByName('fishImage_' + target_id);
  var ipt_id = document.getElementById('inputform_' + target_id);
  var tgt_id = document.getElementById(target_id);
  parent.removeChild(ipt_id);
  var ipt_id = document.getElementById('inputform_' + target_id);
  parent.removeChild(ipt_id);
  parent.removeChild(tgt_id);	
}