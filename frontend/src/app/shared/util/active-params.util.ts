import {ActiveParamsType} from '../../../types/active-params.type';

export class ActiveParamsUtil {
  static processParams(params: ActiveParamsType): ActiveParamsType {
    const activeParams: ActiveParamsType = {categories: []};

    if (params.hasOwnProperty("categories")) {
      // @ts-ignore
      activeParams.categories = Array.isArray(params["categories"]) ? params["categories"] : [params["categories"]];
    }

    if (params.hasOwnProperty("page")) {
      if (params["page"] !== undefined) {
        activeParams.page = Number(params["page"]);
      } else {
        activeParams.page = 1;
      }
    } else {
      activeParams.page = 1;
    }

    return activeParams;
  }
}
