import { omit, omitBy, isNil, pick } from 'lodash';
import { convertTableListParams } from '@/utils/format';
import { TableListDefaultParams } from '@/models/response';
import { TablePaginationConfig } from 'antd/es/table';
import env from '@/utils/env';
/**
 * 车辆记录列表，过滤掉需要额外处理的查询参数，传递额外处理后的查询参数
 *
 * @export
 * @param {TableListDefaultParams} params
 * @param {{ [s: string]: any }} [otherSearch]
 * @returns
 */
export function formatCarRecordListParams(
  params: TableListDefaultParams,
  otherSearch?: { [s: string]: any },
) {
  if (!params) return {};
  return convertTableListParams({ ...omit(params, 'carNo'), ...otherSearch });
}

/**
 * 统一记录页码和 id 的 map 实例的 key 格式
 *
 * @export
 * @param {number} index
 * @param {string} [carNo]
 * @returns
 */
export function formatPageIDKey(index: number, params?: { [s: string]: any }) {
  return `${index}${
    !params ||
    // 每个值为 null undefined 空字符串
    Object.values(params).every((item) => isNil(item) || (typeof item === 'string' && !item.trim()))
      ? ''
      : '-' +
        Object.entries(params)
          .map((item) => `${item[0]}=${item[1]}`)
          .join('&')
  }`;
}

/**
 * 创建分页器的返回首页按钮
 *
 * @returns {HTMLButtonElement}
 */
const createBackBtn = (): HTMLButtonElement => {
  let backFirstPageBtn = document.createElement('button') as HTMLButtonElement;
  // let backFirstPageBtn = getDefaultResetBtn().cloneNode(true) as HTMLButtonElement;
  backFirstPageBtn.classList.add(...'ant-btn ant-btn-primary back-first-page'.split(' '));
  backFirstPageBtn.innerHTML = '<span>返回首页</span>';
  return backFirstPageBtn;
};

const createCurrentPageSpan = (value: string): HTMLSpanElement => {
  let span = document.createElement('span');
  span.classList.add('current-page-content');
  span.innerText = value;
  return span;
};

/**
 * 汽车记录列表统一的 onLoad 事件，获取 pagination input 并禁用
 *
 * @export
 * @param {(React.MutableRefObject<HTMLInputElement | undefined>)} inputRef
 * @returns
 */
export function onCarRecordTableLoad(
  inputRef: React.MutableRefObject<HTMLInputElement | undefined>,
  getButton: (ele: HTMLButtonElement) => void,
) {
  return () => {
    let pagination = document.querySelector(`.ant-table-pagination.ant-pagination`) as HTMLElement;
    if (pagination) {
      let pager = pagination.querySelector('.ant-pagination-simple-pager') as HTMLLIElement;
      let pageInput = pager.querySelector(
        '.ant-pagination-simple-pager > input',
      ) as HTMLInputElement;

      // 添加返回首页按钮
      if (!pagination.firstElementChild || pagination.firstElementChild.tagName !== 'BUTTON') {
        let backBtn = createBackBtn();
        pagination.insertBefore(backBtn, pagination.firstElementChild);
        getButton(backBtn);
      }
      // 调整样式
      // pager.setAttribute('style', 'margin: 0;line-height: inherit; vertical-align: top;');
      inputRef.current = pageInput;
      // 防止 input 输入
      pageInput.setAttribute('disabled', 'true');
      // 隐藏 input
      pageInput.setAttribute('style', 'display: none');
      // pager.removeChild(pageInput);
      // pager.innerHTML = '';
      // pager.appendChild(pageInput);
      if (pager.firstElementChild && pager.firstElementChild!.tagName === 'SPAN') {
        (pager.firstElementChild as HTMLSpanElement).innerText = pageInput.value;
      } else {
        let span = createCurrentPageSpan(pageInput.value);
        pager.insertBefore(span, pageInput);
      }
    } /* else if (pagination && inputRef.current) {
      let pager = pagination.querySelector('.ant-pagination-simple-pager') as HTMLLIElement;
      let span = pager.querySelector('span');
      span && (span!.innerText = inputRef.current.value);
    } */
  };
}

/* 汽车记录统一分页配置 */
export const CarRecordPaginationConfig: TablePaginationConfig = {
  defaultPageSize: 10,
  // defaultPageSize: 1,
  defaultCurrent: 1,
  showSizeChanger: false,
  simple: true,
  showQuickJumper: false,
  showTitle: false,
};

export class CarRecordParamsManager {
  map: Map<string, string[]> = new Map([['0', []]]);
  getID = (...params: [number, { [s: string]: any } | undefined]) => {
    !env.isProd() &&
      console.log(
        'get id => ',
        formatPageIDKey(...params),
        this.map.get(formatPageIDKey(...params)),
      );
    return this.map.get(formatPageIDKey(...params)) || [];
  };
  setID = (...[index, params, ids]: [number, { [s: string]: any } | undefined, string[]]) => {
    // 首页时清空此 map 之前记录的数据
    if (index === 1) {
      this.clear();
    }
    !env.isProd() && console.log('set id => ', formatPageIDKey(index, params), ids);
    return this.map.set(formatPageIDKey(index, params), ids);
  };
  clear = () => {
    this.map.clear();
  };
}
/**
 * 取出需要的非分页相关的车辆记录相关的参数
 *
 * @export
 * @param {{ [s: string]: any }} [params]
 * @returns
 */
export function processCarRecordOtherParams(params?: { [s: string]: any }) {
  if (!params) return undefined;
  return omitBy(pick(params, 'carNo'), isNil);
}
