import { Core } from '../modules';
const getPreferredUnit = async (quantityType) => {
    const units = await Core.getPreferredUnits([quantityType]);
    const unit = units[0]?.unit;
    if (!unit) {
        throw new Error(`No preferred unit found for quantity type: ${quantityType}`);
    }
    return unit;
};
export default getPreferredUnit;
