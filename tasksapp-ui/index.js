const local_host_link = "http://localhost:8080/"
function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", local_host_link +"notes");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects.data) {
          trHTML += '<tr>'; 
          trHTML += '<td>'+object['id']+'</td>';         
          trHTML += '<td>'+object['note_title']+'</td>';
          trHTML += '<td>'+object['note_text']+'</td>';          
          trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showEditBox(\''+object['id']+'\')">Edit</button>';
          trHTML += '<button type="button" class="btn btn-outline-danger" onclick="Delete(\''+object['id']+'\')">Del</button></td>';
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
      }
    };
  }

  function checkConnection(){
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", local_host_link);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);       
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Connected',
          showConfirmButton: false,
          timer: 1500
        })
      } else {           
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Connection is failed!'          
        });
      }
      
    }
  }
  checkConnection()
  loadTable();

  function showCreateBox() {
    Swal.fire({
      title: 'Create note',
      html:        
        '<input id="note_title" class="swal2-input" placeholder="Note title">' +
        '<input id="note_text" class="swal2-input" placeholder="Note text">',
      focusConfirm: false,
      preConfirm: () => {
        Create();
      }
    })
  }
  
  function Create() {
    const note_title = document.getElementById("note_title").value;
    const note_text = document.getElementById("note_text").value;   
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", local_host_link + "note");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
        "note":{
      "note_title": note_title, "note_text": note_text
        }
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
      }
    };
  }

  function showEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET",local_host_link+ "get_note/"+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        const note = objects['data'];
        console.log(note);
        Swal.fire({
          title: 'Edit Note',
          html:
            '<input id="id" type="hidden" value='+note[0]['id']+'>' +     
            '<div><label for="html"><b>Note Title</b></label>' +           
            '<input id="note_title" class="swal2-input" placeholder="Note title" value="'+note[0]['note_title']+'"></div>' + 
            '<div><label for="html"><b>Note Text</b></label>' +    
            '<input id="note_text" class="swal2-input" placeholder="Note text" value="'+note[0]['note_text']+'"></div>' ,
          focusConfirm: false,
          preConfirm: () => {
            Edit();
          }
        })
      }
    };
  }
  
  function Edit() {
    const id = document.getElementById("id").value;
    const note_title = document.getElementById("note_title").value;
    const note_text = document.getElementById("note_text").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", local_host_link +"note/"+id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
        "note":{
                "note_title": note_title, "note_text": note_text
            }
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
      }
    };
  }

  function Delete(id) {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
          const xhttp = new XMLHttpRequest();
          xhttp.open("DELETE", local_host_link+"note/"+id);
          xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({ 
      "id": id
          }));
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(
          'Deleted!',
          objects['message'],
          'success'
        )
       
        loadTable();
      } 
    };

        
      }
    })
    
  }