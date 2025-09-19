import yaml from 'js-yaml';

export function convertToYaml(jsObject) {
  return yaml.dump(jsObject, { 
    lineWidth: -1, // Disable line wrapping
    noRefs: true   // Don't use YAML references
  });
}