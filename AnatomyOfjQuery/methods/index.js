/**
 * @description 判断是否为函数
 */
const isFunction = function isFunction(obj) {
  let condition1 = typeof obj === "function";
  //在IE中document.createElement("object")的结果是function
  let condition2 = typeof obj.nodeType !== "number";
  let condition3 = typeof obj.item !== "function";
  return condition1 && condition2 && condition3;
};

/**
 * @description 判断是否为window对象
 */
const isWindow = function isWindow(obj) {
  //利用window.window===window的特性
  return obj != null && obj === obj.window;
};

const TypeString = "Boolean Number String Function Array Date RegExp Object Error Symbol";
const TypeMap = {};
TypeString.split(" ").forEach(function (item) {
  TypeMap["[object " + item + "]"] = item.toLowerCase();
});

const getType = function getType(obj) {
  if (obj === null) {
    return "null";
  }
  // 如果是判断是对象或者函数,则使用Object.prototype.toString.call(obj)
  // 如果是不包含在TypeString中的类型,则直接返回object
  // 其他的直接返回typeof obj
  return typeof obj === "object" || typeof obj === "function" ? TypeMap[Object.prototype.toString.call(obj)] || "object" : typeof obj;
};

const isEmptyObject = function isEmptyObject(obj) {
  let name;
  for (name in obj) {
    return false;
  }
  return true;
};
/**
 * @description 判断是否为类数组
 */
const isArrayLike = function isArrayLike(obj) {
  let length = !!obj && "length" in obj && obj.length;
  let type = getType(obj);
  if (isWindow(obj) && isFunction(obj)) {
    return false;
  }

  //类数组类型不是数组,且含有length属性,且length>0
  return type === "array" || length === 0 || (typeof length === "number" && length > 0 && length - 1 in obj);
};
var rmsPrefix = /^-ms-/, // IE9-11 不支持以-ms-开头的样式
  rdashAlpha = /-([a-z])/g, //-开头的字符串
  rnothtmlwhite = /[^\x20\t\r\n\f]+/g; //获取属性值???
function fcamelCase(_all, letter) {
  return letter.toUpperCase(); //转化为大写
}
const camelCase = function camelCase(string) {
  return string
    .replace(rmsPrefix, "ms-") //替换-ms-为ms-
    .replace(rdashAlpha, fcamelCase); //替换-后面的首个字母为大写
};

//数据对象
const Expando = "expando"; //特殊属性:还不知道是什么
function Data() {
  this.expando = Expando + Data.uid++;
}
Data.uid = 1;
Data.prototype = {
  cache: function (owner) {
    //判断是否已经缓存,如果没有缓存,则创建一个缓存对象
    let value = owner[this.expando];
    if (!value) {
      value = {};
      // if(){}  这里有一个不知道作用的判断
    }
    return value;
  },
  set: function (owner, data, value) {
    let prop,
      cache = this.cache(owner);
    if (typeof data === "string") {
      cache[camelCase(data)] = value;
    } else {
      for (prop in data) {
        cache[camelCase(prop)] = data[prop];
      }
    }
    return cache;
  },

  get: function (owner, key) {
    return key === undefined ? this.cache(owner) : owner[this.expando] && owner[this.expando][camelCase(key)];
  },
  access: function (owner, key, value) {
    if (value === undefined) {
      return this.get(owner, key);
    }
    if (key && typeof key === "string" && value === undefined) {
      return this.get(owner, key);
    }
    this.set(owner, key, value);
    return value !== undefined ? value : key;
  },
  remove(owner, key) {
    let i,
      cache = owner[this.expando];
    if (cache === undefined) {
      return;
    }
    if (key !== undefined) {
      if (Array.isArray(key)) {
        key = key.map(camelCase);
      } else {
        key = camelCase(key);
        key = key in cache ? [key] : key.match(rnotwhite) || [];
      }
      i = key.length;
      while (i--) {
        delete cache[key[i]];
      }
    }
    if (key === undefined || isEmptyObject(cache)) {
      //如果key为undefined,则删除所有缓存
      delete owner[this.expando];
    }
  },
  hasDate(owner){
    let cache = owner[this.expando];
    return cache !== undefined && !isEmptyObject(cache);
  }
};
