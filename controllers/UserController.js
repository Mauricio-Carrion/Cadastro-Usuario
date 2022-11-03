class UserController {
  constructor(formIdCreate, formIdUpdate, tBodyId) {
    this.formEl = document.getElementById(formIdCreate);
    this.formUpdateEl = document.getElementById(formIdUpdate);
    this.tableEl = document.getElementById(tBodyId);
    this.addUserBox = document.getElementById('add_user');
    this.editUserBox = document.getElementById('edit_user');
    this.btnCancelEdit = document.getElementById('btn-cancel-edit');
    this.onSubmit();
    this.onEdit();
  };

  onEdit() {
    document.querySelector('#edit_user .btn-cancel').addEventListener('click', e => {
      e.preventDefault()
      this.showPanelCreate();
    });

    this.formUpdateEl.addEventListener('submit', e => {
      e.preventDefault();

      let btnSubmit = this.formUpdateEl.querySelector('[type=submit]');

      btnSubmit.disabled = true;

      let values = this.getValues(this.formUpdateEl);

      let index = this.formUpdateEl.dataset.trIndex;

      let tr = this.tableEl.rows[index];

      tr.dataset.user = JSON.stringify(values);

      tr.innerHTML = `
      <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
      <td>${values.name}</td>
      <td>${values.email}</td>
      <td>${values.admin ? 'Sim' : 'Não'}</td>
      <td>${Utils.dateFormat(values.register)}</td>
      <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>
      `;

      this.addEventsTr(tr);

      this.calc();

      this.formUpdateEl.reset();

      btnSubmit.disabled = false;

      this.showPanelCreate();

    });
  };

  onSubmit() {
    this.formEl.addEventListener('submit', e => {
      e.preventDefault();

      let values = this.getValues(this.formEl);
      let btnSubmit = this.formEl.querySelector('[type=submit]');

      btnSubmit.disabled = true;

      if (values) {

        this.getPhoto().then((content) => {

          values.photo = content
          btnSubmit.disabled = false;

          this.addLine(values);
          this.formEl.reset();

        }, (e) => {

          console.error(e);

        });

      } else {

        btnSubmit.disabled = false;

      };
    });
  };

  getPhoto() {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      let photo = [...this.formEl.elements].filter(e => {
        if (e.name === 'photo') {
          return e;
        };
      });

      let file = photo[0].files[0];

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (e) => {
        reject(e);
      };

      if (file) {
        fileReader.readAsDataURL(file);
      } else {
        resolve('dist/img/boxed-bg.jpg')
      };
    });
  };

  getValues(form) {
    let user = {};
    let isValid = true;

    [...form.elements].forEach(field => {
      if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

        field.parentElement.classList.add('has-error');
        isValid = false;

      } else {

        field.parentElement.classList.remove('has-error');

      }

      if (field.name === 'gender') {

        if (field.checked) {

          user[field.name] = field.value;

        };

      } else if (field.name == 'admin') {

        user[field.name] = field.checked;

      } else {

        user[field.name] = field.value;

      };
    });

    if (!isValid) {

      return false;

    };

    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
  };

  addLine(userData) {
    const tr = document.createElement('tr');

    tr.dataset.user = JSON.stringify(userData);

    tr.innerHTML = `
        <td><img src="${userData.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${userData.name}</td>
        <td>${userData.email}</td>
        <td>${userData.admin ? 'Sim' : 'Não'}</td>
        <td>${Utils.dateFormat(userData.register)}</td>
        <td>
          <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
    `

    this.addEventsTr(tr);

    this.tableEl.appendChild(tr);

    this.calc();
  };

  addEventsTr(tr) {
    tr.querySelector('.btn-edit').addEventListener('click', e => {
      let json = JSON.parse(tr.dataset.user);
      let formEdit = document.querySelector('#form-user-update');

      formEdit.dataset.trIndex = tr.sectionRowIndex;

      for (let name in json) {
        let field = formEdit.querySelector(`[name='${name.replace('_', '')}']`);

        if (field) {
          switch (field.type) {
            case 'file':
              continue;

            case 'radio':
              field = formEdit.querySelector(`[name='${name.replace('_', '')}'][value='${json[name]}']`);
              field.checked = true;
              break;

            case 'checkbox':
              field.checked = json[name];
              break;

            default:
              field.value = json[name];
          }
        }
      }

      this.showPanelEdit();
    });
  }

  showPanelCreate() {
    this.addUserBox.style.display = 'block';
    this.editUserBox.style.display = 'none';
  }

  showPanelEdit() {
    this.addUserBox.style.display = 'none';
    this.editUserBox.style.display = 'block';
  }

  calc() {
    const userCounter = document.getElementById('userCounter');
    const adminCounter = document.getElementById('adminCounter');
    const users = [...this.tableEl.children];

    users.forEach(e => {

      userCounter.innerHTML = users.length;

      let userInfo = JSON.parse(e.dataset.user);

      console.log(userInfo)

      if (userInfo._admin) {
        adminCounter.innerHTML++;
      };

    });
  };

};