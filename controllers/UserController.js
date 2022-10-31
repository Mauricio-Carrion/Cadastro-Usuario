class UserController {
  constructor(formId, tBodyId) {
    this.formEl = document.getElementById(formId);
    this.tableEl = document.getElementById(tBodyId);
    this.addUserBox = document.getElementById('add_user');
    this.editUserBox = document.getElementById('edit_user');
    this.onSubmit();
  };

  onSubmit() {
    this.formEl.addEventListener('submit', e => {
      e.preventDefault();

      let values = this.getValues();
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

  getValues() {
    let user = {};
    let isValid = true;

    [...this.formEl.elements].forEach(field => {
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

    tr.querySelector('.btn-edit').addEventListener('click', e => {
      this.addUserBox.style.display = 'none';
      this.editUserBox.style.display = 'block';
    });

    this.tableEl.appendChild(tr);
    this.calc();
  };

  calc() {
    const userCounter = document.getElementById('userCounter');
    const adminCounter = document.getElementById('adminCounter');

    [...this.tableEl.children].forEach(e => {

      userCounter.innerHTML++;

      let userInfo = JSON.parse(e.dataset.user);

      if (userInfo._admin) {
        adminCounter.innerHTML++;
      };

    });
  };

};