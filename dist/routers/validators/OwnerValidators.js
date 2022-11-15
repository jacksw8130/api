"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerValidators = void 0;
const express_validator_1 = require("express-validator");
const Owner_1 = require("../../models/Owner");
const Superadmin_1 = require("../../models/Superadmin");
const Admin_1 = require("../../models/Admin");
class OwnerValidators {
  static signup() {
    return [
      (0, express_validator_1.body)("name", "name is Required").isString(),
      (0, express_validator_1.body)(
        "password",
        "password is Required"
      ).isString(),
      (0, express_validator_1.body)("email", "email Is Required").custom(
        (email, { req }) => {
          return Owner_1.default.findOne({ email: email }).then((owner) => {
            if (owner) {
              throw new Error("owner Already Exist");
            } else {
              return true;
            }
          });
        }
      ),
      (0, express_validator_1.body)(
        "phone",
        "Phone with numeric value Is Required"
      )
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone must be 10 digit")
        .custom((phone, { req }) => {
          return Owner_1.default.findOne({ phone: phone }).then((owner) => {
            if (owner) {
              throw new Error("owner Already Exist");
            } else {
              return true;
            }
          });
        }),
    ];
  }
  static createSuperadmin() {
    return [
      (0, express_validator_1.body)("name", "name is Required").isString(),
      (0, express_validator_1.body)(
        "password",
        "password is Required"
      ).isString(),
      (0, express_validator_1.body)("email", "email Is Required").custom(
        (email, { req }) => {
          return Superadmin_1.default
            .findOne({ email: email })
            .then((superadmin) => {
              if (superadmin) {
                throw new Error("Super admin Already Exist");
              } else {
                return true;
              }
            });
        }
      ),
      (0, express_validator_1.body)(
        "phone",
        "Phone with numeric value Is Required"
      )
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone must be 10 digit")
        .custom((phone, { req }) => {
          return Superadmin_1.default
            .findOne({ phone: phone })
            .then((superadmin) => {
              if (superadmin) {
                throw new Error("Super admin Already Exist");
              } else {
                return true;
              }
            });
        }),
    ];
  }
  static login() {
    return [
      (0, express_validator_1.query)("email", "Email is Required").custom(
        (email, { req }) => {
          return Owner_1.default.findOne({ email: email }).then((owner) => {
            if (owner) {
              req.owner = owner;
              return true;
            } else {
              throw new Error("owner Does Not Exist");
            }
          });
        }
      ),
      (0, express_validator_1.query)(
        "password",
        "Password is Required"
      ).isAlphanumeric(),
    ];
  }
  static updateSuperadmin() {
    return [
      (0, express_validator_1.param)("id").custom((id, { req }) => {
        return Superadmin_1.default
          .findOne({ _id: id }, { __v: 0 })
          .then((superadmin) => {
            if (superadmin) {
              req.superadmin = superadmin;
              return true;
            } else {
              throw new Error("Super admin Does Not Exist");
            }
          });
      }),
    ];
  }
  static allOwner() {
    return [
      (0, express_validator_1.param)("id").custom((id, { req }) => {
        return Superadmin_1.default
          .findOne({ _id: id }, { __v: 0 })
          .then((superadmin) => {
            if (superadmin) {
              req.superadmin = superadmin;
              return true;
            } else {
              throw new Error("Super admin Does Not Exist");
            }
          });
      }),
    ];
  }
  static allUser() {
    return [
      (0, express_validator_1.param)("id").custom((id, { req }) => {
        return Admin_1.default
          .findOne({ _id: id }, { __v: 0 })
          .then((admin) => {
            if (admin) {
              req.admin = admin;
              return true;
            } else {
              throw new Error("admin Does Not Exist");
            }
          });
      }),
    ];
  }
  static transfer() {
    return [
      (0, express_validator_1.body)("coins", "coins is Required").isNumeric(),
      (0, express_validator_1.body)(
        "superadmin_id",
        "superadmin_id Is Required"
      )
        .isString()
        .custom((superadmin_id, { req }) => {
          return Superadmin_1.default
            .findOne({ _id: superadmin_id })
            .then((superadmin) => {
              if (superadmin) {
                return true;
              } else {
                throw new Error("Super Admin  not Exist");
              }
            });
        }),
    ];
  }
  static withdraw() {
    return [
      (0, express_validator_1.body)(
        "superadmin_id",
        "superadmin_id Is Required"
      )
        .isString()
        .custom((superadmin_id, { req }) => {
          return Superadmin_1.default
            .findOne({ _id: superadmin_id })
            .then((superadmin) => {
              if (superadmin) {
                return true;
              } else {
                throw new Error("Super Admin  not Exist");
              }
            });
        }),
      (0, express_validator_1.body)("coins", "coins is Required")
        .isNumeric()
        .custom((coins, { req }) => {
          return Superadmin_1.default
            .findOne({ _id: req.body.superadmin_id, wallet: { $gte: coins } })
            .then((superadmin) => {
              if (superadmin) {
                return true;
              } else {
                throw new Error("Super Admin Low balance");
              }
            });
        }),
    ];
  }
}
exports.OwnerValidators = OwnerValidators;
