const officeDetail = {
    dataAvailabilities: [],
    office: null,
    availabilitiesContent: null,
};

officeDetail.init = async function () {
   if(!app.currentId){
    app.navigate('office');
   }
   officeDetail.availabilitiesContent = document.querySelector('#container-list-detail tbody');
   
   
   // AJAX
   const office = await app.controllers.office.get(app.currentId);
   officeDetail.dataAvailabilities = await app.controllers.officeAvailability.getAll();
   
   document.querySelector('#card-office-detail .card-title').innerHTML = office.name

   //RENDER TABLE
   officeDetail.renderTable();
}


officeDetail.goToEditOfficeAvailability = function() {
    app.navigate('office-availability');
}



officeDetail.renderTable = () => {
    let content = '';

    officeDetail.dataAvailabilities.forEach((e, index) => {
        content += `
        <tr>
            <td>${e.startDate}</td>
            <td>${e.endDate}</td>
            <td>${e.slotDuration}</td>
            <td>
                <button class="btn btn-primary" onclick="officeAvailability.edit(${index})">M</button>
                <button class="btn btn-danger" onclick="officeAvailability.remove(${index})">S</button>
            </td>
        </tr>
        `;
    });

    console.log('content', content);
   officeDetail.availabilitiesContent.innerHTML = content;
}

app.controllers.officeDetail = officeDetail;