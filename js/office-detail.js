const officeDetail = {
    dataAvailabilities: [],
    office: null,
    availabilitiesContent: null,
};

officeDetail.init = async function () {
   if(!app.currentId){
    app.navigate('office');
    return;
   }
   officeDetail.availabilitiesContent = document.querySelector('#container-list-detail tbody');
   
   // AJAX
   const office = await app.controllers.office.get(app.currentId);
   officeDetail.dataAvailabilities = await app.controllers.officeAvailability.getAll().catch(() => []);
   officeDetail.dataAvailabilities = officeDetail.dataAvailabilities.filter(a => a.officeId === app.currentId)

   document.querySelector('#card-office-detail .card-title').innerHTML = office.name

   //RENDER TABLE
   officeDetail.renderTable();
}


officeDetail.goToEditOfficeAvailability = function(id) {
    app.secondCurrentId = id;
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
                <button class="btn btn-primary" onclick="officeDetail.goToEditOfficeAvailability('${e.id}')">M</button>
                <button class="btn btn-danger" onclick="officeDetail.remove(${index})">S</button>
            </td>
        </tr>
        `;
    });

   officeDetail.availabilitiesContent.innerHTML = content;
}


officeDetail.remove = async (index) => {
    const record = officeDetail.dataAvailabilities[index];
    if (record != null && confirm(`Voulez-vous vraiment supprimer cette disponibilité ?`)) {

        try {
            await $.ajax({
                type: 'DELETE',
                url: `${app.api}/office-availability/${record.id}`,
            });
            officeDetail.dataAvailabilities.splice(index, 1);
            officeDetail.renderTable();
        } catch (e) {
            alert('Impossible de supprimer cette disponibilité !');
        }

    }
}

app.controllers.officeDetail = officeDetail;