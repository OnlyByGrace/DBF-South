describe("Sermons Section", function () {
	describe("sermon model", function () {
		it("should override sync", function () {
			var thisModel = new SermonModel();
			expect(thisModel.sync).toBeTruthy();
		});
	});
});