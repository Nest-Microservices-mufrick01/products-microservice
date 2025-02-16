import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService')


  onModuleInit() {
    this.$connect();
    this.logger.log(`DataBase connected`)
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.product.create({
      data:createProductDto
    })

    return product;
  }

  async findAll(paginationDto:PaginationDto) {

    const {page,limit} = paginationDto;

    const totalProducts = await this.product.count({where:{available:true}});
    const lastPage = Math.ceil(totalProducts/limit);


    const data = await this.product.findMany({
      where:{available:true},
      take:limit,
      skip: (page-1)*limit
    });

    return {
      meta:{
        total: totalProducts,
        page,
        lastPage
      },
      data
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({where:{id,available:true}})
    if(!product){
      throw new RpcException(
        {
          status:HttpStatus.NOT_FOUND,
          message:`product with id #${id} not found`
        }
      )
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const {id:_,...data} = updateProductDto;
    try {
      const product = await this.product.update({where:{id, available:true},data})
      return product;

    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.product.update(
      {
        where:{id, available:true},
        data:{ available:false }
      }
    );
    } catch (error) {
      this.handleErrors(error)
    }
  }

  private handleErrors(error:any){
    if(error.code === "P2025"){
      throw new RpcException(
        {
          status:HttpStatus.NOT_FOUND,
          message:`product to update/delete not found`
        }
      )
    }
    this.logger.error(error.meta.cause)
    throw new RpcException(
      {
        status:HttpStatus.INTERNAL_SERVER_ERROR,
        message:'Something failed, check logs'
      }
    )
  }


}
