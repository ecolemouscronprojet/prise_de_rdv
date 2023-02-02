const officeAvailability = {
    data: [],
    offices: [],
};
// #container-list
//officeAvailability.edit

officeAvailability.init = async function () {
    const officeId = $('#officeId');
    officeAvailability.offices = await office.getAll();

    officeId.append(officeAvailability.offices.map(o => `<option value="${o.id}">${o.name}</option>`).join(''))

    officeAvailability.data = await officeAvailability.getAll().catch(() => {
        alert('Impossible de récupérer les disponibilités des bureaux');
        return [];
    });

}



officeAvailability.edit = (index) => {
    if (index !== undefined) {
       officeAvailability.fillForm(index);
    }
};


officeAvailability.fillForm = (index) => {
    const record = officeAvailability.data[index];

    console.log(record);
    if(record != null) {
        $('input[name="id"]').val(record.id);
        $('select[name="officeId"]').val(record.officeId);
        $('input[name="startDate"]').val(record.startDate);
        $('input[name="endDate"]').val(record.endDate);
        $('input[name="slotDuration"]').val(record.slotDuration);
    }

    
};


officeAvailability.save = async (event) => {
    event.preventDefault();
    const id = $('input[name="id"]').val();
    const officeId = $('select[name="officeId"]').val();
    const startDate = $('input[name="startDate"]').val();
    const endDate = $('input[name="endDate"]').val();
    const slotDuration = $('input[name="slotDuration"]').val();

    if (
        officeId.trim().length === 0 ||
        startDate.trim().length === 0 ||
        endDate.trim().length === 0 ||
        slotDuration.trim().length === 0
        ) {
        alert('Tous les champs sont obligatoires !!!');
        return;
    }

    const record = officeAvailability.data.find(d => d.id == id);
    // EDITION
    try {
        if (record) {
            const officeAvailabilitySaved = await $.ajax({
                type: 'PUT',
                url: `${app.api}/office-availability/${record.id}`,
                data: { 
                    officeId,
                    startDate,
                    endDate,
                    slotDuration,
                  }
            })
            record.startDate = officeAvailabilitySaved.startDate;
            record.endDate = officeAvailabilitySaved.endDate;
            record.slotDuration = officeAvailabilitySaved.slotDuration;
        }
        // AJOUT
        else {
            const officeAvailabilitySaved = await $.ajax({
                type: 'POST',
                url: `${app.api}/office-availability`,
                data: { 
                    officeId,
                    startDate,
                    endDate,
                    slotDuration,
                  }
            })
            officeAvailability.data.push(officeAvailabilitySaved);
        }
    } catch (e) {
        if(e.responseJSON && e.responseJSON.error) {
            alert(e.responseJSON.error);
        } else {
            alert(record ? 'Impossible de modifier cette disponibilité' : 'Impossible d\'ajouter cette disponibilité');
        }
    }
};


officeAvailability.remove = async (index) => {
    const record = officeAvailability.data[index];
    if (record != null && confirm(`Voulez-vous vraiment supprimer cette disponibilité ?`)) {

        try {
            await $.ajax({
                type: 'DELETE',
                url: `${app.api}/office-availability/${record.id}`,
            });
            officeAvailability.data.splice(index, 1);
            officeAvailability.renderTable();
        } catch (e) {
            alert('Impossible de supprimer cette disponibilité !');
        }

    }
}

officeAvailability.getAll = () => {
    return $.ajax({
        type: 'GET',
        url: `${app.api}/office-availability`,
    })
};

app.controllers.officeAvailability = officeAvailability;