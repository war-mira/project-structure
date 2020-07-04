export default class SearchInput {
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
        <div class="form-group">
            <label class="form-label">Сортировать по:</label>
            <input type="text" data-element="filterName" class="form-control" placeholder="">
        </div>`;
  }
  
  render() {
    const element = document.createElement('div');
  
    element.innerHTML = this.template;
  
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initEventListener();

    return this.element;
  }
  
  initEventListener(){
      const {filterName} = this.subElements;
      filterName.addEventListener('input', event => {
        this.element.dispatchEvent(new CustomEvent('input-change', {
            detail: filterName.value,
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
  
  
  