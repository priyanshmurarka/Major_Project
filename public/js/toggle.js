 let taxSwitch = document.getElementById("switchCheckDefault");
    taxSwitch.addEventListener("click", ()=> {
      let tax = document.getElementsByClassName("tax-percent");
      for(info of tax){
        if(info.style.display != "inline")
        info.style.display = "inline";
        else
        info.style.display = "none";
      }
    });