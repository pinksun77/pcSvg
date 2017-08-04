export default {
	methods: {
		filterColor(val){
			if (!val && val != 0) {
				return ""
			}
			let result = "";
			result = "#"+val.slice(0,6);//+val.slice(6,8)
			return result;

		}
	}
}