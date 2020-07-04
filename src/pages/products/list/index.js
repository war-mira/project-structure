import SortableTable from '../../../components/sortable-table/index.js';
import DoubleSlider from '../../../components/double-slider/index.js';
import SearchInput from '../../../components/search-input/index.js';
import SearchSelect from '../../../components/search-select/index.js';

import fetchJson from '../../../utils/fetch-json.js';
import header from './products-header.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async initComponents () {
    this.min = 0;
    this.max = 4000;
    this.searchStr = '';
    this.searchStatus = 1;

    const sortableTable = new SortableTable(header, {
      url: `api/rest/products?_embed=subcategory.category`,
      isSortLocally: false,
      link: 'products/'
    });

    const searchInput = new SearchInput({
      url: `api/rest/products?_embed=subcategory.category&price_gte=${this.min}&price_lte=${this.max}&_sort=title&_order=asc&_start=0&_end=30`,
    });

    const searchSelect = new SearchSelect({
      url: `api/rest/products?_embed=subcategory.category&price_gte=${this.min}&price_lte=${this.max}&_sort=title&_order=asc&_start=0&_end=30`,
    });

    const doubleSlider = new DoubleSlider({
      min: this.min,
      max: this.max
    });

    this.components.sortableTable = sortableTable;
    this.components.searchInput = searchInput;
    this.components.doubleSlider = doubleSlider;
    this.components.searchSelect = searchSelect;
  }
  async updateTableComponent () {
    const data = await fetchJson(`${process.env.BACKEND_URL}
      api/rest/products?_embed=subcategory.category&
      price_gte=${this.min}&
      price_lte=${this.max}&
      title_like=${this.searchStr}&
      status=${this.searchStatus}&
      _sort=title&_order=asc&_start=0&_end=30`
    );
    this.components.sortableTable.addRows(data);
  }

  get template () {
    return `<div class="products-list">
      <div class="content__top-panel">
        <h2 class="page-title">Товары</h2>
        <a href="/products/add" class="button-primary">Добавить товар</a>
      </div>
      <div class="content-box content-box_small">
        <form class="form-inline">
          <div class="form-group" data-element="searchInput"></div>
          <div class="form-group" data-element="doubleSlider"></div>
          <div class="form-group" data-element="searchSelect"></div>
        </form>
      </div>
      <div data-element="productsContainer" class="products-list__container">
          <div data-element="sortableTable">
          <!-- sortable-table component -->
        </div>
      </div>
    </div>`;
  }

  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  initEventListeners () {
    this.components.searchInput.element.addEventListener('input-change', event => {
      this.searchStr = event.detail;
      this.updateTableComponent()
    });

    this.components.searchSelect.element.addEventListener('status-change', event => {
      this.searchStatus = event.detail;
      this.updateTableComponent()
    });

    this.components.doubleSlider.element.addEventListener('range-select', event => {
      const { from, to } = event.detail;
      this.min = from;
      this.max = to;
      this.updateTableComponent()
    });
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];
      root.append(element);
    });
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

   remove () {
    this.element.remove();
  }

  destroy () {
    this.remove();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}