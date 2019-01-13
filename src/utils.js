import _ from "lodash";

/**
 *
 * @param {array of Object} items
 * @param {string} keword
 * @param {array of string} searchProperties
 * @param {func} customSearchFilterFunc a typical Array.filter func
 */
export const filterByMultiProperties = (
  items = [],
  keyword = "",
  searchProperties = [],
  customSearchFilterFunc
) => {
  if (searchProperties.length === 0 && items.length > 0 && !!items[0]) {
    searchProperties = Object.keys(items[0]);
  }
  return keyword.length > 0
    ? _.filter(items, item => {
        if (customSearchFilterFunc) {
          if (customSearchFilterFunc(item)) {
            return true;
          }
        }
        if (
          searchProperties.some(key => {
            return new RegExp(_.escapeRegExp(keyword), "ig").test(item[key]);
          })
        ) {
          return true;
        }
        return false;
      })
    : items;
};

/**
 * Usage: moveArrayElement().top(["1","2","3"],2);
 * @return { items:{[Object]}, itemIndex:{number}}
 */
export const moveArrayElement = {
  top: (items, index) => {
    if (items.length <= 1 || index === 0) {
      return {
        items,
        itemIndex: index
      };
    }

    return {
      items: [
        items[index],
        ...items.slice(0, index),
        ...items.slice(index + 1)
      ],
      itemIndex: 0
    };
  },
  up: (items, index) => {
    if (items.length <= 1 || index === 0) {
      return {
        items,
        itemIndex: index
      };
    }
    return {
      items: [
        ...items.slice(0, index - 1),
        items[index],
        items[index - 1],
        ...items.slice(index + 1)
      ],
      itemIndex: index - 1
    };
  },
  down: (items, index) => {
    if (index === items.length - 1)
      return {
        items,
        itemIndex: index
      };
    return {
      items: [
        ...items.slice(0, index),
        items[index + 1],
        items[index],
        ...items.slice(index + 2)
      ],
      itemIndex: index + 1
    };
  },
  bottom: (items, index) => {
    if (index === items.length - 1)
      return {
        items,
        itemIndex: index
      };
    return {
      items: [
        ...items.slice(0, index),
        ...items.slice(index + 1),
        items[index]
      ],
      itemIndex: items.length - 1
    };
  }
};

//uuid from https://cythilya.github.io/2017/03/12/uuid/
export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 
 * @param {Object} aclRole 
 * {
      "dmp" : {
        "location" : {
          "delete" : true,
          "edit" : false,
          "view" : false
        },
        "audience" : {
          "delete" : false,
          "edit" : false,
          "view" : true
        }
        ....
      }
    @returns ['location:delete', 'audience:view']
}
 */
export const aclRoleInDbToOption = aclRole => {
  const { dmp } = aclRole;
  const operationArray = [];
  Object.keys(dmp).forEach(pageName => {
    Object.keys(dmp[pageName]).forEach(operationName => {
      if (dmp[pageName][operationName]) {
        operationArray.push(
          `${pageName.toLowerCase()}:${operationName.toLowerCase()}`
        );
      }
    });
  });
  return {
    can: operationArray
  };
};

/**
 * Access Control List ( Role Based )
 * Create a acl object to check permission.
 * 1.cilent-side usage
 *   acl(user).can('location:view') will return a Boolean
 * 2.server-side usage
 *   await acl(user, model).can('location:view') will return a Boolean
 * @param {Object} user - the user object has aclRole object property
 * @param {Object} model - the mongoose model
 *
 */
export const acl = (user, model) => {
  if (!user || !user.aclRole) {
    return {
      can: () => false
    };
  }
  const initAclRole = aclRoleInDbToOption(user.aclRole);
  const check = (role = {}, operation = "") => {
    if (operation.includes(":")) {
      return role.can.includes(operation.toLowerCase());
    }
    return role.can.some(c => c.startsWith(operation.toLowerCase()));
  };
  return {
    can: (operation = "") => {
      // promise can api is for server-side usage, it will check the database everytime invoked.
      if (model) {
        return new Promise((resolve, reject) => {
          model.AclRole.findOne({ _id: user.aclRole._id })
            .then(aclRole => {
              resolve(aclRole);
            })
            .catch(error => {
              reject(error);
            });
        }).then(aclRoleFromDb => {
          const newAclRole = aclRoleInDbToOption(aclRoleFromDb);
          return check(newAclRole, operation);
        });
      }
      // sync can api is for client-side usage
      return check(initAclRole, operation);
    }
  };
};
