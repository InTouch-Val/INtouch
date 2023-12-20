'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Creates a composite decorator based on the provided plugins
                                                                                                                                                                                                                                                                   */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (decorators, getEditorState, setEditorState) {
  var convertedDecorators = (0, _immutable.List)(decorators).map(function (decorator) {
    var Component = decorator.component;
    var DecoratedComponent = function DecoratedComponent(props) {
      return _react2.default.createElement(Component, _extends({}, props, { getEditorState: getEditorState, setEditorState: setEditorState }));
    };
    return _extends({}, decorator, {
      component: DecoratedComponent
    });
  }).toJS();

  return new _draftJs.CompositeDecorator(convertedDecorators);
};