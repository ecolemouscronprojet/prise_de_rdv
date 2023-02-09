const app = {
    defaultPage: 'office',
    api: 'http://localhost:3005',
    templates: new Map(),
    controllers: {},
    content: document.getElementById('app'),
    currentId: null,
    secondCurrentId: null,
};

app.init = function () {
    window.addEventListener('hashchange', () => {
        const tplName = window.location.hash.slice(1);
        app.displayTpl(tplName);
    });

    this.navigate(this.defaultPage);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
};

app.navigate = (path) => {
    window.location.hash = `#${path}`;
}


app.displayTpl = async (tpl) => {
    //récupérer le tpl 
    if (!app.templates.has(tpl)) {
        await app.loadTemplate(tpl);
    }
    const _tpl = app.templates.get(tpl);
    app.content.innerHTML = _tpl;
    // INIT controller
    const tplCamelCase = tpl.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    if(app.controllers[tplCamelCase] != null) {
        app.controllers[tplCamelCase].init();
    }

}

app.loadTemplate = function (tpl) {
    return $.ajax({
        type: 'GET',
        url: `tpl/${tpl}.tpl.html`,
        dataType: 'html',
    }).then((data) => {
        app.templates.set(tpl, data);
    }).fail(() => {
        alert('Impossible de récupérer le template');
    });
}



app.init();
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