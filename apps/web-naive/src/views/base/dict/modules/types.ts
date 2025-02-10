export interface DictOption {
  dictCode: string;
  dictName: string;
  dictDesc: string;
  [key: string]: any;
}

export interface DictItemOption {
  label: string;
  value: string;
  sort: number;
  desc: string;
  status: 1 | 0;
  pid: string;
  [key: string]: any;
}
