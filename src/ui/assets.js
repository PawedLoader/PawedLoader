const AssetsHandler = require('../classes/AssetHandler');
const GUIAssets = new AssetsHandler();
async function loadAssets() {
  await GUIAssets.saveGZ('icon', `H4sIAAAAAAAAA01SSW7bQBD8SoP3MqeX2QJJh9x9ygsCJpADWLERCaafn2rmEoDoITnTtfWc7h9X+fj1c//69nleihSJMSVaX+Tz9vr7fl5eHo/3L+u67/vT7k9vf66rlVJW9i2X0/Vyev/+eJEf5+W5d9ExNqjCHQOtScMIVFhBRw0xQ0+KAq1iXUIq1wY71iptSAvRJuFSZXSYyeT2EC1oDu3oxNWbxZQ6N+4QOAy1wAtmyIQ3ceNhQoJ4ynbq4ol/hSxqQkSe40byqmiIF6kqVmRSnElUREiv6C6tP0+CapCPKBVsCnSqa9AJoz+arFDnabpVbsKpHNEOs02UTOJOLszkcemalOZHpfOWhu3mNK0+NtWMgayF4fiQkdI4m5mRdE1P1tOlB4alKB3Ho6mOpvmTqohcDy1Uq5M+wUQcpD3qsv43Pq8MpbTNIuWS02dWDoTReGY5CVKdy7dJKQTh4r1sJXmIHdkGNox0TuJBF5Q29K6FezW/ZOiNCVNJ5jlBwYoooLXBkcA5rZls/NcpArwmYBZM2V8HvGY2kTZSIPEoOyVTUcl7k2HRm0TPkPhaWTWdrryseW0vfwE5q1mv9AIAAA==`, 'data:image/svg+xml;base64,');
  GUIAssets.update('icon', (data) => btoa(data.replace('<svg ', '<svg style="fill:#ffffff;" ')));
}
GUIAssets.loadAssets = loadAssets;
module.exports = GUIAssets;