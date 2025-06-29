using System.Net.Sockets;
using AutoMapper;
using DeliveryOrderApp.Api.Data;
using DeliveryOrderApp.Api.Models;
using DeliveryOrderApp.Api.Models.DTO;
using DeliveryOrderApp.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace DeliveryOrderApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly OrderDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPdfService _pdfService;

        public OrdersController(OrderDbContext context, IMapper mapper, IPdfService pdfService)
        {
            _context = context;
            _mapper = mapper;
            _pdfService = pdfService;
        }
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderCreateDto orderdDTO)
        {
            Order order = new();
            try
            {
                 order = _mapper.Map<Order>(orderdDTO);
            }
            catch (AutoMapper.AutoMapperMappingException)
            {
                return BadRequest($"Ошибка преобразования данных заказа");
            }
            catch (Exception)
            {
                return StatusCode(500, $"Ошибка преобразования данных заказа");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                order.Id = Guid.NewGuid();
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
            }
            catch (InvalidOperationException invalidOpEx)
            {

                if (invalidOpEx.InnerException is NpgsqlException npgEx)
                {
                    if (npgEx.InnerException is SocketException socketEx)
                    {
                        return StatusCode(503, "Сервис временно недоступен: Не удалось подключиться к базе данных. Проверьте ее доступность.");
                    }
                    else if (npgEx.SqlState.StartsWith("08"))
                    {
                        return StatusCode(503, "Сервис временно недоступен: Проблема с подключением к базе данных.");
                    }
                }
                return StatusCode(500, "Ошибка базы данных при создании заказа. Пожалуйста, попробуйте позже.");
            }
            catch (DbUpdateException dbEx)
            {

                if (dbEx.InnerException is NpgsqlException npgEx)
                {
                    switch (npgEx.SqlState)
                    {
                        case "23505":
                            return Conflict("Ошибка: Заказ с таким номером или комбинацией данных уже существует. Пожалуйста, проверьте введенные данные.");
                        default:
                            return StatusCode(500, "Ошибка базы данных при создании заказа. Пожалуйста, попробуйте позже.");
                    }
                }
                else
                {
                    return StatusCode(500, "Ошибка базы данных при создании заказа. Пожалуйста, попробуйте позже.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Произошла внутренняя ошибка сервера при создании заказа.");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            try
            {
                var orders = await _context.Orders.ToListAsync();
                return Ok(orders);
            }
            catch (InvalidOperationException invalidOpEx)
            {

                if (invalidOpEx.InnerException is NpgsqlException npgEx)
                {
                    if (npgEx.InnerException is SocketException socketEx)
                    {
                        return StatusCode(503, "Сервис временно недоступен: Не удалось подключиться к базе данных. Проверьте ее доступность.");
                    }
                    else if (npgEx.SqlState.StartsWith("08"))
                    {
                        return StatusCode(503, "Сервис временно недоступен: Проблема с подключением к базе данных.");
                    }
                }
                return StatusCode(500, "Ошибка базы данных при получении заказов. Пожалуйста, попробуйте позже.");
            }

            catch (Exception)
            {
                return StatusCode(500, "Произошла внутренняя ошибка сервера при получении заказов.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(Guid id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);

                if (order == null)
                {
                    return NotFound();
                }

                return order;
            }
            catch (InvalidOperationException invalidOpEx)
            {

                if (invalidOpEx.InnerException is NpgsqlException npgEx)
                {
                    if (npgEx.InnerException is SocketException socketEx)
                    {
                        return StatusCode(503, "Сервис временно недоступен: Не удалось подключиться к базе данных. Проверьте ее доступность.");
                    }
                    else if (npgEx.SqlState.StartsWith("08"))
                    {
                        return StatusCode(503, "Сервис временно недоступен: Проблема с подключением к базе данных.");
                    }
                }
                return StatusCode(500, "Ошибка базы данных при получении заказов. Пожалуйста, попробуйте позже.");
            }

            catch (Exception)
            {
                return StatusCode(500, "Произошла внутренняя ошибка сервера при получении заказов.");
            }
        }

        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GenerateOrderReportPdf(Guid id)
        {
            try
            {
                var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound($"Заказ с ID {id} не найден.");
                }

                byte[] pdfBytes = _pdfService.GenerateOrderPdf(order);

                return File(pdfBytes, "application/pdf", $"Отчёт_{order.Id}.pdf");
            }
            catch (InvalidOperationException invalidOpEx)
            {
                if (invalidOpEx.InnerException is NpgsqlException npgEx)
                {
                    if (npgEx.InnerException is SocketException socketEx)
                    {
                        return StatusCode(503, "Сервис временно недоступен: Не удалось подключиться к базе данных. Проверьте ее доступность.");
                    }
                    else if (npgEx.SqlState.StartsWith("08"))
                    {
                        return StatusCode(503, "Сервис временно недоступен: Проблема с подключением к базе данных.");
                    }
                }
                return StatusCode(500, "Ошибка базы данных при подготовке PDF-отчета. Пожалуйста, попробуйте позже.");
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "Ошибка базы данных при подготовке PDF-отчета. Пожалуйста, попробуйте позже.");
            }
            catch (Exception)
            {
                return StatusCode(500, $"Произошла внутренняя ошибка сервера при генерации PDF");
            }
        }
    }
}
