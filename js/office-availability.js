const officeAvailability = {
    offices: [],
    availability: null
};
// #container-list
//officeAvailability.edit

officeAvailability.init = async function () {
    $('input[name="officeId"]').val(app.currentId);
    
    officeAvailability.availability = await $.get(`${app.api}/office-availability/${app.secondCurrentId}`);
    officeAvailability.fillForm(officeAvailability.availability);
}



officeAvailability.edit = (index) => {
    if (index !== undefined) {
       officeAvailability.fillForm(index);
    }
};


officeAvailability.fillForm = (record) => {
    if(record != null) {
        $('input[name="id"]').val(record.id);
        $('input[name="startDate"]').val(record.startDate);
        $('input[name="endDate"]').val(record.endDate);
        $('input[name="slotDuration"]').val(record.slotDuration);
    }
};


officeAvailability.save = async (event) => {
    event.preventDefault();
    const id = $('input[name="id"]').val();
    const officeId = $('input[name="officeId"]').val();
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

    const record = null;
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
        }
        app.navigate(`office-detail`);
    } catch (e) {
        if(e.responseJSON && e.responseJSON.error) {
            alert(e.responseJSON.error);
        } else {
            alert(record ? 'Impossible de modifier cette disponibilité' : 'Impossible d\'ajouter cette disponibilité');
        }
    }
};


officeAvailability.getAll = () => {
    return $.ajax({
        type: 'GET',
        url: `${app.api}/office-availability`,
    })
};

app.controllers.officeAvailability = officeAvailability;