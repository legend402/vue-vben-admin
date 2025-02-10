import {requestClient} from "#/api/request";
import {type Ref, ref, watch} from "vue";
import type {DictItemOption} from "#/views/base/dict/modules/types";
import {storageUtils} from "#/utils/store";
import type {ListResponse} from "#/types/request";

export default function useDictOption(dictCode: string | Ref<string>) {
  const options = ref<DictItemOption[]>([])

  const innerCode = ref(dictCode)

  watch(innerCode, (code) => {
    getDictItemOption(code)
  }, { immediate: true })

  function getDictItemOption(code: string) {
    if (storageUtils.getItem(code)) {
      options.value = storageUtils.getItem<DictItemOption[]>(code)!
    }
    requestClient.get<ListResponse<DictItemOption>>(`/dict/getDictByCode`, {
      params: {
        pageNum: 1,
        pageSize: 999,
        dictCode: code,
        status: 1,
      },
    }).then(res => {
      options.value = res.items
      storageUtils.setItem(code, res.items);
    })
  }
  return options
}
