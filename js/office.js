const office = {
    data: [],
};

office.init = async function () {
    // get DOM elements

    office.containerList = document.querySelector('#container-list');

    office.data = await office.getAll().catch(() => {
            alert('Impossible de récupérer les bureaux');
            return [];
    });
        
    office.renderList();
}

office.renderList = () => {
    let content = '';
    office.data.forEach((e, index) => {
        content += `
            <div class="col-4 mt-4">
                <div class="card">
                    <img src="images/desktop.png" class="mt-2 desktop-img card-img-top">
                    <div class="card-body">
                    <h5 class="card-title">${e.name}</h5>
                    <p class="card-text">Ici description du bureau</p>
                    <a href="#" onclick="office.goDetail(event, '${e.id}')" class="btn btn-primary">Consulter le bureau</a>
                    </div>
                </div>
            </div>
            `;
    });
    // onclick="office.edit(${index})"
    // onclick="office.remove(${index})"
    office.containerList.innerHTML = content;

}

office.toggleForm = () => {
    $('#office-form form input').val('');
    $('#container-list, #container-manage, #office-form').toggle();
}

office.save = async (event) => {
    event.preventDefault();
    const id = $('input[name="id"]').val();
    const name = $('input[name="name"]').val();
    if(name.trim().length === 0) {
        alert('Tous les champs sont obligatoires !!!');
        return;
    }
    
    const record = office.data.find(d => d.id == id);
    // EDITION
    try{
        if(record) {
            const officeSaved = await $.ajax({
                type: 'PUT',
                url: `${app.api}/office/${record.id}`,
                data: { name }
            })
            record.name = officeSaved.name;
        } 
        // AJOUT
        else {
            const officeSaved = await $.ajax({
                type: 'POST',
                url: `${app.api}/office`,
                data: { name }
            })
            office.data.push(officeSaved);
        }

        office.renderList();
        office.toggleForm();
    } catch(e) {
        alert(record ? 'Impossible de modifier ce bureau' : 'Impossible d\'ajouter ce bureau');
    }
};

office.edit = (index) => {
    office.toggleForm();
    if (index !== undefined) {
        office.fillForm(index);
    }
};

office.fillForm = (index) => {
    const record = office.data[index];
    if(record != null) {
        $('input[name="id"]').val(record.id);
        $('input[name="name"]').val(record.name);
    }
};

office.goDetail = (event, id) => {
    event.preventDefault();
    app.currentId = id;
    app.navigate('office-detail');
}

office.remove = async (index) => {
    const record = office.data[index];
    if (record != null && confirm(`Voulez-vous vraiment supprimer ce bureau: ${record.name} ?`)) {

        try {
            await $.ajax({
                type: 'DELETE',
                url: `${app.api}/office/${record.id}`,
            });
            office.data.splice(index, 1);
            office.renderList();
        } catch (e) {
            alert('Impossible de supprimer ce bureau !');
        }

    }
}


office.getAll = () => {
    return $.ajax({
        type: 'GET',
        url: `${app.api}/office`,
    })
};


office.get = (id) => {
    return $.ajax({
        type: 'GET',
        url: `${app.api}/office/${id}`,
    })
};

app.controllers.office = office;

