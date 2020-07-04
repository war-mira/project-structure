export default class SearchSelect {
    element;
    subElements = {};
  
  // eslint-disable-next-line no-empty-pattern
  constructor({
    url = '',

  } = {}) {
    this.url = url;
  
    this.render();
  }
  
  get template() {
    return `
      <label class="form-label">Статус:</label>
      <select class="form-control" data-element="filterStatus">
        <option value="" selected="">Любой</option>
        <option value="1">Активный</option>
        <option value="0">Неактивный</option>
      </select>`;
  }
  
  render() {
    const element = document.createElement('div');
  
    element.innerHTML = this.template;
  
    this.element = element;
    this.subElements = this.getSubElements(this.element);

    this.initEventListener();

    return this.element;
  }
  
  initEventListener(){
    const {filterStatus} = this.subElements;
    filterStatus.addEventListener('change', event => {
      const status = filterStatus.options[filterStatus.selectedIndex].value;
      this.element.dispatchEvent(new CustomEvent('status-change', {
          detail: status,
          bubbles: true
        }));
    });
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
  
  remove() {
    this.element.remove();
  }
  
  destroy() {
    this.remove();
  }
}
  
  
  