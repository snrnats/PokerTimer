using Microsoft.EntityFrameworkCore.Migrations;

namespace PokerTimer.Api.Migrations
{
    public partial class _1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MyUltraPuperField",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MyUltraPuperField",
                table: "AspNetUsers",
                nullable: true);
        }
    }
}
