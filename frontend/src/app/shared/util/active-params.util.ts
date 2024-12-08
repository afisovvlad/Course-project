import {ActiveParamsType} from '../../../types/active-params.type';

export class ActiveParamsUtil {
  static processParams(params: ActiveParamsType): ActiveParamsType {
    const activeParams: ActiveParamsType = {categories: []};

    if (params.hasOwnProperty("categories")) {
      // @ts-ignore
      activeParams.categories = Array.isArray(params["categories"]) ? params["categories"] : [params["categories"]];
    }

    if (params.hasOwnProperty("page")) {
      activeParams.page = params["page"];
    }

    return activeParams;
  }
}
