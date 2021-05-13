//a customer extract from the prototype lib

function $() {
  var elements = new Array();

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);

    if (arguments.length == 1)
      return element;

    elements.push(element);
  }

  return elements;
}

var Form = {
  serialize: function(form) {
    var elements = Form.getElements($(form));
    var queryComponents = new Array();

    for (var i = 0; i < elements.length; i++) {
      var queryComponent = Form.Element.serialize(elements[i]);
      if (queryComponent)
        queryComponents.push(queryComponent);
    }

    return queryComponents.join('&');
  },

  getElements: function(form) {
    form = $(form);
    var elements = new Array();

    for (tagName in Form.Element.Serializers) {
      var tagElements = form.getElementsByTagName(tagName);
      for (var j = 0; j < tagElements.length; j++)
        elements.push(tagElements[j]);
    }
    return elements;
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name)
      return inputs;

    var matchingInputs = new Array();
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) ||
          (name && input.name != name))
        continue;
      matchingInputs.push(input);
    }

    return matchingInputs;
  },

  disable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.blur();
      element.disabled = 'true';
    }
  },

  enable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.disabled = '';
    }
  },

  findFirstElement: function(form) {
    return Form.getElements(form).find(function(element) {
      return element.type != 'hidden' && !element.disabled &&
        ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
    });
  },

  focusFirstElement: function(form) {
    Field.activate(Form.findFirstElement(form));
  },

  reset: function(form) {
    $(form).reset();
  }
};

Form.Element = {
  serialize: function(element) {
    element = $(element);

    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);

    if (parameter) {
      var key = encodeURIComponent(parameter[0]);
      if (key.length == 0) return;

      if (parameter[1].constructor != Array)
        parameter[1] = [parameter[1]];

      return parameter[1].map(function(value) {
        return key + '=' + encodeURIComponent(value);
      }).join('&');
    }
  },

  getValue: function(element) {
    var elm = $FN(element);
	if (!elm || (typeof(elm) == "string" ))
		return "";
    var method = elm.tagName.toLowerCase();
/*	if (!Form.Element.Serializers[method]) {
		elm = document.forms[0].elements[element];
		method = elm.tagName.toLowerCase();
	}
*/
	try {
    var parameter = Form.Element.Serializers[method](elm);

    if (parameter)
      return parameter[1];
	} catch (ex) {
		return null;
	}
  }
};

Form.Element.Serializers = {
  input: function(element) {
    switch (element.type.toLowerCase()) {
      case 'submit':
      case 'hidden':
      case 'password':
      case 'text':
        return Form.Element.Serializers.textarea(element);
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element);
    }
    return false;
  },

  inputSelector: function(element) {
    if (element.checked)
      return [element.name, element.value];
  },

  textarea: function(element) {
    return [element.name, element.value];
  },

  select: function(element) {
    return Form.Element.Serializers[element.type == 'select-one' ?
      'selectOne' : 'selectMany'](element);
  },

  selectOne: function(element) {
    var value = '', opt, index = element.selectedIndex;
    if (index >= 0) {
      opt = element.options[index];
      value = opt.value;
      if (!value && !('value' in opt))
        value = opt.text;
    }
    return [element.name, value];
  },

  selectMany: function(element) {
    var value = new Array();
    for (var i = 0; i < element.length; i++) {
      var opt = element.options[i];
      if (opt.selected) {
        var optValue = opt.value;
        if (!optValue && !('value' in opt))
          optValue = opt.text;
        value.push(optValue);
      }
    }
    return [element.name, value];
  }
};


var $F = Form.Element.getValue;
function $FN(name) {
	return document.forms[0].elements[name];
}
