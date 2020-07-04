import SortableList from '../../components/sortable-list/index.js';
import NotificationMessage from '../../components/notification/index.js'
import fetchJson from '../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async getCategoryListData(){
    const CATEGORIES = `${process.env.BACKEND_URL}api/rest/categories?_sort=weight&_refs=subcategory`;
    const data = await fetchJson(CATEGORIES);

    return data;
  }

  async initDataLoading(){
    const data = await this.getCategoryListData()
    this.renderCategories(data)
  }

  get template () {
    return `
    <div class="categories">
        <div class="content__top-panel">
            <h2 class="page-title">Категории товаров</h2>
        </div>
        <div data-element="body"></div>
    </div>`;
  }
  
  categoryTemplate (id, title, subcategory){
    const wrapper = document.createElement('div')
    wrapper.innerHTML = `
      <div data-id="${id}" class="category category_open">
        <header class="category__header" data-toggle-handle="">${title}</header>
        <div class="category__body">
          <div class="subcategory-list"></div>
        </div>
      </div>`
    const list = this.getCategoryItem(subcategory)
    const category = wrapper.firstElementChild;
    category.querySelector('.subcategory-list').append(list);

    return category;
  }

  initEventListeners(){
    this.initCategoryShowToggle()
    this.initNotifications()
  }

  initCategoryShowToggle(){
    this.subElements.querySelectorAll('.category__header').forEach(item =>{
      item.addEventListener('click', e => {
        const parent = item.closest('.category')
        parent.classList.toggle('category_open')
      })
    })
  }

  initNotifications(){
    this.element.addEventListener('sortable-list-reorder', async(event) => {
      const target = event.target
      const updatedList = []
      
      target.querySelectorAll('.sortable-list__item').forEach((item, index) => {
        updatedList.push({'id': item.dataset.id, 'weight': index+1})
      })
      
      const result = await this.updateCategoryOrder(updatedList)
      this.showNotification(result)
    });
  }

  async updateCategoryOrder(params){
    const updateUrl = `${process.env.BACKEND_URL}api/rest/subcategories`;

    try{
      const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      const data = await response.status
      return data
    } catch (error) {
      return error
    }
  }

  showNotification(status){
    const duration = 2000
    let message = 'Category order saved'
    let type = 'success'

    if(!status === 200){
      message = 'Category order saving error';
      type = 'error'
    }
    const notification = new NotificationMessage(message, {
      duration: duration,
      type: type
    });
    notification.show();
  }

  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element)[0];

    await this.initDataLoading()

    this.initEventListeners()

    return this.element;
  }

  renderCategories(data){
    const arr = []
    data.map(item => {
      const {id, title, subcategories} = item
      arr.push(this.categoryTemplate(id, title, subcategories))
    })

    this.subElements.append(...arr);
  }

  getCategoryItem(category){
    const listItem = []
    
    category.map(item => {
      listItem.push(this.getListItemTemplate(item))
    })
    const sortList = new SortableList({items: listItem});
    return sortList.element
  }

  getListItemTemplate(item){
    const listItem = document.createElement('li')
    listItem.innerHTML = `
      <li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${item.id}">
        <strong>${item.title}</strong>
        <span><b>${item.count}</b> products</span>
      </li>`
    return listItem.firstElementChild
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return Object.values(accum);
    }, {});
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}